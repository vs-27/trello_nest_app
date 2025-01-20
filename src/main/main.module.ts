import { CartController } from './controllers/api/cart.controller';
import { UserController } from './controllers/api/user.controller';
import { AuthController } from './controllers/render-views/auth.controller';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
    CartService,
    AuthGuard
  ],
  exports: [UserService, CartService],
})
export class MainModule {}
