import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  readonly firstName?: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName?: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
