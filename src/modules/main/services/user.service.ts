import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserOauthEntity } from '../entities/user-oauth.entity';
import { UserResponseInterface } from '../types/userResponse.interface';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { HashService } from './hash.service';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };

    const checkUser = async (field: keyof CreateUserDto, value: string) => {
      const user = await this.userRepository.findOne({
        where: { [field]: value },
      });
      if (user) {
        errorResponse.errors[field] = 'has already been taken';
      }
      return user;
    };

    const userByEmail = await checkUser('email', createUserDto.email);
    const userByUsername = await checkUser('username', createUserDto.username);

    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };

    const options = {};
    if (loginUserDto.email) options['email'] = loginUserDto.email;
    if (loginUserDto.username) options['username'] = loginUserDto.username;

    if (!Object.keys(options).length) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const user = await this.userRepository.findOne({
      where: options,
      select: ['id', 'username', 'email', 'password', 'firstName', 'lastName', 'createdAt' ],
    });

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete user.password;
    return user;
  }

  async processOauth(dto: CreateUserDto, { tokensData, profile }): Promise<{ JWT: string, user: UserEntity }> {
    let user: UserEntity|null = await this.userRepository.findOne({
      where: { email: profile.email },
    });

    if (!user) {
      dto.password = HashService.generateRandomString(dto.email, 16, false);
      dto.username = dto.email;

      user = await this.createUser(dto);

      const oauthProfile = new UserOauthEntity();
      oauthProfile.user = user;
      oauthProfile.profile = profile;
      oauthProfile.tokensData = tokensData;

      await this.em.save(oauthProfile);
    }

    return { JWT: this.generateJwt(user), user };
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
