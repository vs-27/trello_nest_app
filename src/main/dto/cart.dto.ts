import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class CartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  createdBy: UserEntity;
}
