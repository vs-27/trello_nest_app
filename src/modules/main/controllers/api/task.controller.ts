import {
  Body,
  Controller, Delete, Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../decorators/user.decorator';
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
}
