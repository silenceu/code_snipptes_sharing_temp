import * as newrelic from 'newrelic';
import { Request } from 'express';
import { Body, Controller, Post, Query, Req, Sse } from '@nestjs/common';
import { AddItemsDto, SubscribeOrderDto, MessageEvent } from '../common/dto';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sse')
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Post('add_items')
  async AddItems(@Body() addItemsDto: AddItemsDto) {
    return await this.sseService.AddItems(addItemsDto);
  }

  @Sse('subscribe')
  subscribeOrder(
    @Req() req: Request,
    @Query() subscribeOrderDto: SubscribeOrderDto,
  ): Observable<MessageEvent> {
    newrelic.recordCustomEvent('SSE_Connection', {
      event: 'connected',
      ...subscribeOrderDto,
    });

    req.on('close', () => {
      this.sseService.UnsubscribeOrder(subscribeOrderDto);
      newrelic.recordCustomEvent('SSE_Connection', { event: 'disconnected' });
    });

    return this.sseService.SubscribeOrder(subscribeOrderDto);
  }
}
