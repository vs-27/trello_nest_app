import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { RedisStoreService } from '../services/redis-store.service';

@Injectable()
export class TestCommand {
  constructor(
    private readonly redisStore: RedisStoreService,
    private readonly cartService: CartService,
  ) {}

  @Command({
    command: 'test',
  })
  async test() {
    console.log(JSON.stringify('asdfsdf'));

    const products = {
      "0": {id: 1, name: 'iphone 1', quantity: 12, price: 10},
      "1": {id: 2, name: 'iphone 2', quantity: 23, price: 100},
      "2": {id: 3, name: 'iphone 3', quantity: 34, price: 1000},
      "3": {id: 4, name: 'iphone 4', quantity: 45, price: 10000},
    };
  }
}
