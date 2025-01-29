import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColumnDto } from '../dto/column.dto';
import { BoardEntity } from '../entities/board.entity';
import { ColumnEntity } from '../entities/column.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {
  }

  async createColumn(
    user: UserEntity,
    createColumnDto: CreateColumnDto,
  ): Promise<ColumnEntity> {
    const board = await this.boardRepository.findOne({
      where: { id: createColumnDto.boardId },
      relations: ['createdBy']
    });

    console.log(board);
    if (!board) {
      throw new HttpException(
        `Board with ID ${createColumnDto.boardId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (board.createdBy.id !== user.id) {
      throw new HttpException(`Not this user`, HttpStatus.BAD_REQUEST);
    }

    let column = new ColumnEntity();
    column.boards = board;

    delete createColumnDto.boardId;
    column = Object.assign(column, createColumnDto);

    return await this.columnRepository.save(column);
  }
}
