import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { PlaceOrderDto } from '../common/dto';
import { RedisKeyPrefix } from '../common/enums';

@Injectable()
export class OrderService {
  @InjectRedis() private readonly redis: Redis;
  private readonly logger = new Logger(OrderService.name);
  async PlaceOrder(placeOrderDto: PlaceOrderDto) {
    const id = await this.redis.incr(`${RedisKeyPrefix}:order:id`);
    const order = {
      id,
      tableId: placeOrderDto.tableId,
      items: JSON.stringify(placeOrderDto.items),
    };
    await this.redis.hset(`${RedisKeyPrefix}:order:${id}`, order);
    return order;
  }
}
