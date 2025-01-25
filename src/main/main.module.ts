import { PassportModule } from '@nestjs/passport';
import { RedisStoreService } from '../services/redis-store.service';
import { CartController } from './controllers/api/cart.controller';
import { UserController } from './controllers/api/user.controller';
import { AuthController } from './controllers/render-views/auth.controller';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CartService } from './services/cart.service';
import { GoogleStrategy } from './services/oauth/google.strategy';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      UserEntity
    ]),
  ],
  controllers: [
    UserController,
    CartController,
    AuthController,
  ],
  providers: [
    UserService,
    RedisStoreService,
    CartService,
    AuthGuard,
    GoogleStrategy,
  ],
  exports: [UserService, CartService],
})
export class MainModule {}
