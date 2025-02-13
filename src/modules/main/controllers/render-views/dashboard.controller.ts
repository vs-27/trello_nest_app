import { Controller, Get, Res, Render, Param } from '@nestjs/common';
import { Response } from 'express';
import { BoardService } from '../../services/board.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly boardService: BoardService,
  ) {}

  @Get('/')
  @Render('main/views/layout/dashboard')
  getLoginPage(@Res() res: Response) {
    return {
      title: 'Dashboard page!',
    };
  }

 @Get('/boards')
  @Render('main/views/pages/boards')
  async getAllBoards(@Res() res: Response) {
    const boards = await this.boardService.getAllBoards();
    return { boards };
  }

  @Get('/boards/:id')
  @Render('main/views/pages/board')
  async getBoardById(@Param('id') id: number) {
    const board = await this.boardService.getBoardById(id);
    return { board };
  }

}
