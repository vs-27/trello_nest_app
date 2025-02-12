import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/board.dto';
import { BoardEntity } from '../entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
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

  async deleteBoard(id: number): Promise<boolean> {
    const result = await this.boardRepository.delete(id);
    return result.affected !== 0;
  }
}
