import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/board.dto';
import { BoardEntity } from '../entities/board.entity';
import { ColumnEntity } from '../entities/column.entity';
import { TaskEntity } from '../entities/task.entity';
import { TaskService } from './task.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    private readonly taskService: TaskService,
  ) {}

  async createBoard(createBoardDto: CreateBoardDto): Promise<BoardEntity> {
    const newBoard = this.boardRepository.create(createBoardDto);
    Object.assign(newBoard, createBoardDto);
    return await this.boardRepository.save(newBoard);
  }

  async getAllBoards() {
    return await this.boardRepository.find(
      {select: ['id', 'name', 'description', 'color', 'font', 'backgroundColor']}
      );
  }

  async getBoardById(id: number){
    const board = await this.boardRepository.findOne({ where: { id: Number(id) } });
    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }
    return board;
  }

  async getBoardLanesData(id: number){
    const board = await this.boardRepository.findOne(
      {
          where: { id: Number(id) },
          relations: ['columns'],
        }
      );
    if (!board) {
      throw new NotFoundException(`Board lanes with id ${id} not found`);
    }
    return {
      lanes: await Promise.all(
        board.columns.map(async (column: ColumnEntity) => {
          const tasks = await this.taskService.getTasksByColumn(column);
          return {
            id: column.id,
            title: `${column.title}  #${column.id}`,
            label: column.description,
            cards: tasks.map((task: TaskEntity) => ({
              id: task.id,
              title: `${task.title} #${task.id}`,
              label: `${task.title}  :  ${task.estimation}`,
              description: task.description,
            })),
          };
        })
      ),
    };
  }

  async deleteBoard(id: number): Promise<boolean> {
    const result = await this.boardRepository.delete(id);
    return result.affected !== 0;
  }
}
