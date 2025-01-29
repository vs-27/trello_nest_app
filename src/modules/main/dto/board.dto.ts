import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  color: string;

  @IsString()
  font: string;

  @IsString()
  backgroundColor: string;

  @IsNotEmpty()
  createdBy: UserEntity;
}
