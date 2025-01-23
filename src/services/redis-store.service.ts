import { Injectable } from '@nestjs/common';

import { RedisService, DEFAULT_REDIS } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { validateJSON } from '../helpers/validator.helper';

@Injectable()
export class RedisStoreService {
  public readonly redis: Redis | null;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  async set(key, value) {
    if (typeof value !== 'string' || !validateJSON(value)) value = JSON.stringify(value);

    this.redis.set(key, value);
  }

  async get(key) {
    return JSON.parse(await this.redis.get(key));
  }

  async clear(key) {
    await this.redis.del(key);
  }
}
