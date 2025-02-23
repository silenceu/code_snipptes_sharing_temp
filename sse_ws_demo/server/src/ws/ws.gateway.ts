import { Server } from 'ws';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { SubscribeOrderDto } from '../common/dto';
import { Observable } from 'rxjs';
import { WsService } from './ws.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: 'ws',
})
export class WsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly wsService: WsService) {}

  @SubscribeMessage('subscribe')
  subscribeOrder(
    @MessageBody() subscribeOrderDto: SubscribeOrderDto,
  ): Observable<WsResponse<number>> {
    return this.wsService.SubscribeOrder(subscribeOrderDto);
  }
}
