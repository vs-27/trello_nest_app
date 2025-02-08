import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
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
  handleMessage( @MessageBody() message: Message ): void {
    this.server.emit('chat_message', message)
  }

  handleConnection(@ConnectedSocket() client: Socket): any {
    if(!this.chatService.getClientId(client.id)) this.chatService.addClient(client)
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    this.chatService.removeClient(client.id);
    client.disconnect(true)
  }
}
