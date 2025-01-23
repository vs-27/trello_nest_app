import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RedisService, RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisStoreService } from './redis-store.service';

describe('RedisStoreService (Integration)', () => {
  let redisStoreService: RedisStoreService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RedisModule.forRoot({
          config: {
            url: process.env.REDIS_URL,
          },
        }),
      ],
      providers: [RedisStoreService],
    }).compile();

    redisStoreService = module.get<RedisStoreService>(RedisStoreService);
  });

  afterAll(async () => {
    const redis = (redisStoreService as any).redis;
    await redis.quit(); // Close the Redis connection after tests
  });

  it('"set&get" should set and get a value from Redis', async () => {
    const val = 'test_value';

    await redisStoreService.set('test', val);

    expect(await redisStoreService.get('test')).toEqual(val);
  });
});
