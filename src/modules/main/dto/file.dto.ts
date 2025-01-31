import { IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  fileName: string;

  @IsString()
  filePath: string;

  @IsNumber()
  taskId: number;
}
