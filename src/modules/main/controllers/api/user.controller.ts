import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../../dto/user.dto';
import { UserEntity } from '../../entities/user.entity';
import { BackendValidationPipe } from '../../pipes/backendValidation.pipe';
import { UserService } from '../../services/user.service';
import { UserResponseInterface } from '../../types/userResponse.interface';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post('/reg')
  @UsePipes(new BackendValidationPipe())
  async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('/log')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
}
