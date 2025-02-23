import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsController } from './ws.controller';
import { WsGateway } from './ws.gateway';

@Module({
  providers: [WsService, WsGateway],
  controllers: [WsController],
  imports: [],
})
export class WsModule {}
