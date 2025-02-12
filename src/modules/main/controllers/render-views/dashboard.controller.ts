import { Controller, Get, Res, Render } from '@nestjs/common';
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
}
