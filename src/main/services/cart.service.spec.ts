import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { RedisStoreService } from '../../services/redis-store.service';
import { MainModule } from '../main.module';
import { CartService } from './cart.service';

describe('RedisStoreService (Integration)', () => {
  let cartService: CartService;
  let redisStoreService: RedisStoreService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MainModule],
      providers: [CartService, RedisStoreService],
    }).compile();

    cartService = module.get<CartService>(CartService);
    redisStoreService = module.get<RedisStoreService>(RedisStoreService);
  });

  afterAll(async () => {
    const redis = (redisStoreService as any).redis;
    await redis.quit();
  });


  it('"addToCart" should correctly add product to cart', async () => {
    const userId = 2;
    const someData = {id: 213, price: 2332};

    await redisStoreService.clear(CartService.generateCartRedisKey(userId));

    await cartService.addToCart(userId, someData);

    expect(await redisStoreService.get(CartService.generateCartRedisKey(userId))).toEqual([someData]);
  });

  it('"getCart" should correctly get products from cart', async () => {
    const userId = 2;
    const someData = {id: 213, price: 2332};

    await redisStoreService.clear(CartService.generateCartRedisKey(userId));
    await redisStoreService.set(CartService.generateCartRedisKey(userId), [someData]);

    expect(await cartService.getCart(userId)).toEqual([someData]);
  });
});
