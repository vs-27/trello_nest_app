import { IsNumber, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  boardId: number;
}
