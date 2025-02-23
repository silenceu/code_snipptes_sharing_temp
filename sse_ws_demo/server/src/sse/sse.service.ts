import * as newrelic from 'newrelic';
import Redis from 'ioredis';
import { interval, Subject } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { MessageEvent, AddItemsDto, SubscribeOrderDto } from '../common/dto';
import { ORDER_UPDATE_CHANNEL, RedisKeyPrefix } from '../common/enums';

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);
  private readonly subscriptions: Record<string, Subject<MessageEvent>>;
  private readonly subscriptionCount: Record<string, number>;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRedis('publish') private readonly pubRedis: Redis,
    @InjectRedis('subscribe') private readonly subRedis: Redis,
  ) {
    this.subscriptions = {};
    this.subscriptionCount = {};
    this.subRedis.subscribe(`${ORDER_UPDATE_CHANNEL}:sse`);
    setInterval(() => {
      this.logger.log(
        `subscription count: ${Object.keys(this.subscriptions).length}`,
      );
    }, 10000);
    this.subRedis.on('message', (_, message) => {
      const msgBody = JSON.parse(message);
      if (this.subscriptions[msgBody.orderId]) {
        this.logger.log(`${msgBody.orderId}, addItem`);
        newrelic.recordCustomEvent('SSE_Message', {
          event: 'msgSent',
          message,
        });
        this.subscriptions[msgBody.orderId].next({
          type: 'message',
          data: message,
          retry: 10000,
        });
      }
    });
  }

  async AddItems(addItemsDto: AddItemsDto) {
    const order = await this.redis.hgetall(
      `${RedisKeyPrefix}:order:${addItemsDto.id}`,
    );

    if (!order.items) {
      return false;
    }

    const items = [...JSON.parse(order?.items || '[]'), ...addItemsDto.items];
    await this.redis.hset(`${RedisKeyPrefix}:order:${addItemsDto.id}`, {
      items: JSON.stringify(items),
    });

    await this.pubRedis.publish(
      `${ORDER_UPDATE_CHANNEL}:sse`,
      JSON.stringify({
        orderId: addItemsDto.id,
        newItemIds: addItemsDto.items.map((item) => item.id),
      }),
    );
    return true;
  }

  UnsubscribeOrder(subscribeOrderDto: SubscribeOrderDto) {
    const orderId = subscribeOrderDto.id;
    this.subscriptionCount[orderId]--;

    if (this.subscriptionCount[orderId] <= 0) {
      this.subscriptionCount[orderId] = 0;
      this.subscriptions[orderId] = null;
    }
    this.logger.log(
      `${subscribeOrderDto.id}-${subscribeOrderDto.customerId}, unsubscribe order`,
    );
  }

  SubscribeOrder(subscribeOrderDto: SubscribeOrderDto) {
    let subject = this.subscriptions[subscribeOrderDto.id];
    if (!subject) {
      subject = new Subject<MessageEvent>();
      this.subscriptionCount[subscribeOrderDto.id] = 0;
      this.subscriptions[subscribeOrderDto.id] = subject;
    }
    this.subscriptionCount[subscribeOrderDto.id]++;
    const childSubject = new Subject<MessageEvent>();
    subject.subscribe(childSubject);
    this.logger.log(
      `${subscribeOrderDto.id}-${subscribeOrderDto.customerId}, subscribe order`,
    );
    interval(+process.env.KEEP_ALIVE_HEARTBEAT).subscribe(() => {
      childSubject.next({
        type: 'heartbeat',
        data: '',
      });
    });
    return childSubject.asObservable();
  }
}
