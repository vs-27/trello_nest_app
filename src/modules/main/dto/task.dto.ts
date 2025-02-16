import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  link: string;

  @IsString()
  estimation: string;

  @IsDate()
  startTime?: Date;

  @IsDate()
  endTime?: Date;

  @IsNumber()
  columnId: number;
}

export class MoveTaskDto {
  @IsInt()
  @IsNotEmpty()
  columnId: number;

  @IsInt()
  @IsNotEmpty()
  position: number;
}
