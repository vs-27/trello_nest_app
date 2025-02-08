import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardMessageEntity } from '../../../entities/boardMessage.entity';
import { WsAuthGuard } from '../../../guards/ws-auth.guard';
import { BoardMessageService } from '../../../services/boardMessage.service';

@Controller('messages')
export class BoardMessageController {
  constructor(
    private readonly boardMessageService: BoardMessageService,
    @InjectRepository(BoardMessageEntity)
    private readonly boardMessageRepository: Repository<BoardMessageEntity>,
    ) {}

  //todo: replace by get board messages
  @Post()
  @UseGuards(WsAuthGuard)
  async sendMessage(
    @Request() req,
    @Body('content') content: string,
    @Body('boardId') boardId: number
  ) {
    const user = req.user;
    return this.boardMessageService.sendMessage(user, content, boardId);
  }
}
