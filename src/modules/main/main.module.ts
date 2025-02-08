import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommandModule } from 'nestjs-command';
import { AppDataSource } from '../../../db/data-source';
import { BoardController } from './controllers/api/boards/board.controller';
import { BoardMessageController } from './controllers/api/boards/boardMessage.controller';
import { CartController } from './controllers/api/cart.controller';
import { ColumnController } from './controllers/api/columns/column.controller';
import { TaskController } from './controllers/api/task.controller';
import { UploadController } from './controllers/api/upload.controller';
import { UserController } from './controllers/api/user.controller';
import { AuthController } from './controllers/render-views/auth.controller';
import { DashboardController } from './controllers/render-views/dashboard.controller';
import { BoardEntity } from './entities/board.entity';
import { BoardMessageEntity } from './entities/boardMessage.entity';
import { ColumnEntity } from './entities/column.entity';
import { FileEntity } from './entities/file.entity';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { BoardService } from './services/board.service';
import { BoardMessageService } from './services/boardMessage.service';
import { CartService } from './services/cart.service';
import { ChatGateway } from './services/chat.gateway';
import { ChatService } from './services/chat.service';
import { ColumnService } from './services/column.service';
import { CookieService } from './services/cookie.service';
import { HashService } from './services/hash.service';
import { FacebookStrategy } from './services/oauth/facebook.strategy';
import { GoogleStrategy } from './services/oauth/google.strategy';
import { TwitterStrategy } from './services/oauth/twitter.strategy';
import { RedisStoreService } from './services/redis-store.service';
import { TaskService } from './services/task.service';
import { UploadService } from './services/upload.service';
import { UserService } from './services/user.service';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot(AppDataSource.options), MainModule,
    TypeOrmModule.forFeature([
      UserEntity,
      BoardEntity,
      ColumnEntity,
      TaskEntity,
      FileEntity,
      BoardMessageEntity
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
    DashboardController,
    BoardController,
    ColumnController,
    TaskController,
    UploadController,
    BoardMessageController
  ],
  providers: [
    UserService,
    RedisStoreService,
    CartService,
    AuthGuard,
    GoogleStrategy,
    FacebookStrategy,
    TwitterStrategy,
    HashService,
    CookieService,
    BoardService,
    ColumnService,
    TaskService,
    UploadService,
    ChatGateway,
    ChatService,
    BoardMessageService,
    JwtService
  ],
  exports: [UserService, CartService, JwtService],
})
export class MainModule {  configure(consumer: MiddlewareConsumer) {
  consumer.apply(AuthMiddleware).forRoutes({
    path: '*',
    method: RequestMethod.ALL,
  });
}}
