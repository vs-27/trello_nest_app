import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../../dto/user.dto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
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

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number, @Req() req) {

    const userId = Number(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return { id: user.id, name: user.username };
  }
}
