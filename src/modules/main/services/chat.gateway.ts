import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from '../types/Message';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*'
  }
})
export class  ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

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
