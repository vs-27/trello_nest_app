import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RedisStoreService } from '../services/redis-store.service';

@Injectable()
export class TestCommand {
  constructor(
    private readonly redisStore: RedisStoreService,
  ) {}

  @Command({
    command: 'test',
  })
  async test() {
    await this.redisStore.set('cart_11', ['test1', 'test2', 2332]);
    console.log(await this.redisStore.get('cart_11'));
  }
}
