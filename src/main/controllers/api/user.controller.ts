import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';
import { BackendValidationPipe } from '../../pipes/backendValidation.pipe';
import { UserService } from '../../services/user.service';
import { UserResponseInterface } from '../../types/userResponse.interface';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('/reg')
  @UsePipes(new BackendValidationPipe())
  async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
}
