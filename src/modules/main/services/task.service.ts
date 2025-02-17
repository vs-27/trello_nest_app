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
    const { columnId, startTime, endTime, ...taskData } = createTaskDto;

    const column = await this.columnRepository.findOne({
      where: { id: columnId },
      relations: ['board'],
    });

    if (!column) {
      throw new Error('Column not found');
    }

    if (!user.boards.some(({ id }) => column.board.id === id)) {
      throw new Error('Column not associated with user');
    }

    const task = this.taskRepository.create({
      ...taskData,
      column,
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
    });

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
      relations: ['tasks', 'board'],
    });

    if (!newColumn) {
      throw new NotFoundException('Column not found');
    }

    task.column = newColumn;
    await this.taskRepository.save(task);

    const allTasks = await this.taskRepository.find({
      where: { column: { id: moveData.columnId } },
      order: { position: 'ASC' },
    });

    const excludedCurrent = allTasks.filter((t) => {
      return t.id !== task.id;
    });

    await this.reorderColumnTasks([
      ...excludedCurrent.slice(0, moveData.position),
      task,
      ...excludedCurrent.slice(moveData.position),
    ]);

    return { message: 'Task moved successfully', task };
  }

  async reorderColumnTasks(tasks: TaskEntity[]) {
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].position = i;
      await this.taskRepository.update(tasks[i].id, { position: i });
    }
  }
}
