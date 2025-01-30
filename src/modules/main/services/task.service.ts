import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/task.dto';
import { ColumnEntity } from '../entities/column.entity';
import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  async createTask(
    user: UserEntity,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const { columnId, ...taskData } = createTaskDto;

    const column = await this.columnRepository.findOne({
      where: { id: columnId },
      relations: [ 'board' ],
    });

    if (!column) {
      throw new Error('Column not found');
    }

    const entityData = { ...taskData, createdBy: user };
    entityData['column'] = column;

    if (!user.boards.filter(({ id }) => column.board.id === id).length) {
      throw new Error('Column not associated with user');
    }

    const task = this.taskRepository.create(entityData);

    return this.taskRepository.save(task);
  }
}
