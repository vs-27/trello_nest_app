import { Body, Controller, Delete, Get, Param, Post, Render, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../../decorators/user.decorator';
import { CreateBoardDto } from '../../../dto/board.dto';
import { BoardEntity } from '../../../entities/board.entity';
import { UserEntity } from '../../../entities/user.entity';
import { AuthGuard } from '../../../guards/auth.guard';
import { BoardService } from '../../../services/board.service';

@Controller('')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  @Post('boards')
  @UseGuards(AuthGuard)
  async createBoard(
    @User() user: UserEntity,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardEntity> {
    createBoardDto.createdBy = user;
    return this.boardService.createBoard(createBoardDto);
  }

  @Get('dashboard/boards')
  @Render('main/views/pages/boards.twig')
  async getAllBoards(@Res() res: Response) {
    const boards = await this.boardService.getAllBoards();
    return { boards };
  }

  @Delete('boards:id')
  async deleteBoard(@Param('id') id: number): Promise<boolean> {
    return this.boardService.deleteBoard(id);
  }
}
