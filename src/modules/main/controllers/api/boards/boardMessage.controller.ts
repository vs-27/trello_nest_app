import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardMessageEntity } from '../../../entities/boardMessage.entity';
import { BoardMessageService } from '../../../services/boardMessage.service';

@Controller('messages')
export class BoardMessageController {
  constructor(
    private readonly boardMessageService: BoardMessageService,
    @InjectRepository(BoardMessageEntity)
    private readonly boardMessageRepository: Repository<BoardMessageEntity>,
  ) {
  }

  @Get()
  async getMessages(
    @Query('boardId') boardId: number,
    @Query('userId') userId: number
  ): Promise<{ message: any[] }> {

    const messages = await this.boardMessageRepository.find(
      {
        where: { board: { id: boardId }, user: { id: userId } },
        relations: [ 'board', 'user' ],
        select: {
          id: true,
          content: true,
          createdAt: true,
          board: {
            id: true,
          },
          user: {
            id: true,
            username: true,
          },
        },
        loadRelationIds: {
          relations: [ 'user' ],
        },
      });

    return {
      message: messages.map(({ id, content, createdAt, board, user }) => ({
        id,
        content,
        name: user.username,
        createdAt,
        board: { id: board.id },
        user: { id: user.id },
      })),
    }
  }
}
