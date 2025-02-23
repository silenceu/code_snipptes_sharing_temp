import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ORDER_UPDATE_CHANNEL, RedisKeyPrefix } from '../common/enums';
import { AddItemsDto, SubscribeOrderDto } from '../common/dto';
import { Subject } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';

@Injectable()
export class WsService {
  private readonly logger = new Logger(WsService.name);
  private readonly subscriptions: Record<string, Subject<WsResponse>>;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRedis('publish') private readonly pubRedis: Redis,
    @InjectRedis('subscribe') private readonly subRedis: Redis,
  ) {
    this.subscriptions = {};
    this.subRedis.subscribe(`${ORDER_UPDATE_CHANNEL}:ws`);
    this.subRedis.on('message', (_, message) => {
      const msgBody = JSON.parse(message);
      if (this.subscriptions[msgBody.orderId]) {
        this.logger.log(`${msgBody.orderId}, addItem`);
        this.subscriptions[msgBody.orderId].next({
          event: 'orderUpdate',
          data: msgBody,
        });
      }
    });
  }

  async AddItems(addItemsDto: AddItemsDto) {
    const order = await this.redis.hgetall(
      `${RedisKeyPrefix}:order:${addItemsDto.id}`,
    );
    const items = [...JSON.parse(order.items), ...addItemsDto.items];
    await this.redis.hset(`${RedisKeyPrefix}:order:${addItemsDto.id}`, {
      items: JSON.stringify(items),
    });

    await this.pubRedis.publish(
      `${ORDER_UPDATE_CHANNEL}:ws`,
      JSON.stringify({
        orderId: addItemsDto.id,
        newItemIds: addItemsDto.items.map((item) => item.id),
      }),
    );

    // if (this.subscriptions[addItemsDto.id]) {
    //   this.logger.log(`${addItemsDto.id}, addItem`);
    //   this.subscriptions[addItemsDto.id].next({
    //     event: 'orderUpdate',
    //     data: {
    //       orderId: addItemsDto.id,
    //       newItemIds: addItemsDto.items.map((item) => item.id),
    //     },
    //   });
    // }
    return true;
  }

  SubscribeOrder(subscribeOrderDto: SubscribeOrderDto) {
    let subject = this.subscriptions[subscribeOrderDto.id];
    if (!subject) {
      subject = new Subject<WsResponse>();
      this.subscriptions[subscribeOrderDto.id] = subject;
    }
    this.logger.log(
      `${subscribeOrderDto.id}-${subscribeOrderDto.customerId}, subscribe order`,
    );
    return subject.asObservable();
  }
}
