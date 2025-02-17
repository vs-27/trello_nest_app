import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

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

  @IsOptional()
  @IsISO8601()
  startTime?: string;

  @IsOptional()
  @IsISO8601()
  endTime?: string;

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
