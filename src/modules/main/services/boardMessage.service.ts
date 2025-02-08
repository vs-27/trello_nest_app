import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardEntity } from '../entities/board.entity';
import { BoardMessageEntity } from '../entities/boardMessage.entity';
import { UserEntity } from '../entities/user.entity';


@Injectable()
export class BoardMessageService {
  constructor(
    @InjectRepository(BoardMessageEntity)
    private readonly boardMessageRepository: Repository<BoardMessageEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async sendMessage(user: UserEntity, content: string, boardId: number): Promise<[BoardMessageEntity, BoardEntity]> {
    const board = await this.boardRepository.findOne({ where: { id: boardId }, relations: ['createdBy'] });
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const User = await this.userRepository.findOne({ where: { id: user.id }, select: ['id']});
    if (!User) {
      throw new NotFoundException('User not found');
    }

    if (board.createdBy.id !== User.id) {
      throw new ForbiddenException('You are not the owner of this board');
    }

    const message = this.boardMessageRepository.create({
      content,
      user,
      board
    });

    await this.boardMessageRepository.save(message);
    return [message, board];

  }
}
