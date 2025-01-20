import { CartController } from './controllers/api/cart.controller';
import { UserController } from './controllers/api/user.controller';
import { AuthController } from './controllers/render-views/auth.controller';
import { CartEntity } from './entities/cart.entity';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CartEntity
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
