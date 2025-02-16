import {
  Body,
  Controller,
  Delete,
  Param, Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../decorators/user.decorator';
import { MoveTaskDto } from '../../dto/task.dto';
import { CreateTaskDto } from '../../dto/task.dto';
import { TaskEntity } from '../../entities/task.entity';
import { UserEntity } from '../../entities/user.entity';
import { TaskService } from '../../services/task.service';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @User() user: UserEntity,
  ): Promise<{ task: TaskEntity }> {
    const task = await this.taskService.createTask(user, createTaskDto);
    return { task };
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<boolean> {
    return this.taskService.deleteTask(id);
  }

  @Patch(':id/move')
  async moveTask(@Param('id') id: number, @Body() moveData: MoveTaskDto) {
    return this.taskService.moveTask(Number(id), moveData);
  }
}
