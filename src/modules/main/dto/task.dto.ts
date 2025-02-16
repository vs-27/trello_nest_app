import { IsDate, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  columnId: number;

  @IsNumber()
  boardId: number;
}
