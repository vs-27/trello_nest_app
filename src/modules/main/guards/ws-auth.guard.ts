import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    let token = client.handshake.auth?.token;

    if (!token && client.handshake.headers.authorization) {
      token = client.handshake.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      client.data.user = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
