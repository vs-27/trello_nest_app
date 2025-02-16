import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoveTaskDto } from '../dto/task.dto';
import { CreateTaskDto } from '../dto/task.dto';
import { BoardEntity } from '../entities/board.entity';
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
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
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

  async getTasksByColumn(column: ColumnEntity): Promise<TaskEntity[]> {
    return await this.taskRepository.findBy({ column: column });
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    return result.affected !== 0;
  }

  async moveTask(id: number, moveData: MoveTaskDto) {
    const task = await this.taskRepository.findOne({
      where: { id: id },
      relations: ['column', 'column.board'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const newColumn = await this.columnRepository.findOne({
      where: { id: moveData.columnId },
      relations: ['board'],
    });

    if (!newColumn) {
      throw new NotFoundException('Column not found');
    }

    const boardId = newColumn.board.id;

    if (newColumn.board.id !== boardId) {
      throw new NotFoundException('Board mismatch for the given column');
    }

    task.column = newColumn;
    await this.taskRepository.save(task);

    return { message: 'Task moved successfully', task };
  }
}
