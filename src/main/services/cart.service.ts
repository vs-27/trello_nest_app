import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartDto } from '../dto/cart.dto';
import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {
  }

  async createCart(cartDto: CartDto): Promise<CartEntity> {
    const newCart = this.cartRepository.create(cartDto);
    Object.assign(newCart, cartDto);
    return await this.cartRepository.save(newCart);
  }
}
