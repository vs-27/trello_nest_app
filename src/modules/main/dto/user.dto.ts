import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateUserDto {

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsNotEmpty()
  @IsString()
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

export class LoginUserDto {
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
