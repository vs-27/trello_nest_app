import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../guards/ws-auth.guard';
import { BoardMessageService } from './boardMessage.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*'
  }
})
export class  ChatGateway {
  constructor(private readonly boardMessageService: BoardMessageService) {}
  @WebSocketServer()
  server: Server;


  @UseGuards(WsAuthGuard)
  @SubscribeMessage('chat_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string; boardId: number; },
  ){

    const user = client.data.user;
    if (!user) throw new Error('User not authenticated');

    const [message, board] = await this.boardMessageService.sendMessage(user, data.content, data.boardId);
    this.server.to(`board_${data.boardId}`).emit('chat_message', {name: user.username, content: message.content});
  }
}
