import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../decorators/user.decorator';
import { CartDto } from '../../dto/cart.dto';
import { CartEntity } from '../../entities/cart.entity';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { CartService } from '../../services/cart.service';

@Controller('carts')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {
  }

  @Post()
  @UseGuards(AuthGuard)
  async createBoard(
    @User() user: UserEntity,
    @Body() cartDto: CartDto,
  ): Promise<CartEntity> {
    cartDto.createdBy = user;
    return this.cartService.createCart(cartDto);
  }
}
