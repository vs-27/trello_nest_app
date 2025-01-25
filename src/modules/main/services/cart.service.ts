import { Injectable } from '@nestjs/common';
import { RedisStoreService } from './redis-store.service';

export const REDIS_CART_KEY_PREFIX = 'CART_';

@Injectable()
export class CartService {
  constructor(
    private readonly redisStore: RedisStoreService,
  ) {}

  async getCart(userId: number, defaultValue: any = null): Promise<any> {
    let value = await this.redisStore.get(CartService.generateCartRedisKey(userId));
    return value ? value : defaultValue;
  }

  async addToCart(userId: number, productDto) {
    let cartProducts = await this.getCart(userId, []);
    cartProducts.push(productDto);

    await this.redisStore.set(CartService.generateCartRedisKey(userId), cartProducts)
  }

  async removeFromCart(userId: number, productId: number) {
    const cartProducts = (await this.getCart(userId)).filter(({ id }) => id !== productId);
    await this.redisStore.set(CartService.generateCartRedisKey(userId), cartProducts)
  }

  static generateCartRedisKey(userId: number) {
    return `${REDIS_CART_KEY_PREFIX}_${userId}`;
  }
}
