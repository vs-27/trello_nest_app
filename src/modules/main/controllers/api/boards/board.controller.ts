import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../decorators/user.decorator';
import { CreateBoardDto } from '../../../dto/board.dto';
import { BoardEntity } from '../../../entities/board.entity';
import { UserEntity } from '../../../entities/user.entity';
import { AuthGuard } from '../../../guards/auth.guard';
import { BoardService } from '../../../services/board.service';

@Controller('boards')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createBoard(
    @User() user: UserEntity,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardEntity> {
    createBoardDto.createdBy = user;
    return this.boardService.createBoard(createBoardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBoard(@Param('id') id: number): Promise<boolean> {
    return this.boardService.deleteBoard(id);
  }

  @Get()
  @UseGuards(AuthGuard)
    async getBoards(): Promise<{ boards: BoardEntity[] }>  {
    return {
      boards: await this.boardRepository.find()
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getBoardById(@Param('id') id: number) {
    const board = await this.boardService.getBoardById(id);
    return { board };
  }

  @Get(':id/data')
  @UseGuards(AuthGuard)
  async getBoardData(@Param('id') id: number) {
    const data = await this.boardService.getBoardLanesData(id);
    return { data };
  }
}
