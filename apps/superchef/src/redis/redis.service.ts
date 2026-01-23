import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(key: string, value: string) {
    await this.redis.set(key, value, 'EX', 9e2); // 15 minutes expiration
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
