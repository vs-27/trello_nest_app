import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { CommandModule } from 'nestjs-command';
import { AppDataSource } from '../../../db/data-source';
import { CartController } from './controllers/api/cart.controller';
import { UserController } from './controllers/api/user.controller';
import { AuthController } from './controllers/render-views/auth.controller';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CartService } from './services/cart.service';
import { CookieService } from './services/cookie.service';
import { HashService } from './services/hash.service';
import { GoogleStrategy } from './services/oauth/google.strategy';
import { RedisStoreService } from './services/redis-store.service';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot(AppDataSource.options), MainModule,
    TypeOrmModule.forFeature([
      UserEntity
    ]),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
      }
    }),
    CommandModule,
    HttpModule
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
    HashService,
    CookieService,
  ],
  exports: [UserService, CartService],
})
export class MainModule {}
