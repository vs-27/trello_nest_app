import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JWT_SECRET } from '../../config';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from '../types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
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

    const newUser = new User();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  generateJwt(user: User): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: User): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
