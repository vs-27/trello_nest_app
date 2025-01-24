import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}
