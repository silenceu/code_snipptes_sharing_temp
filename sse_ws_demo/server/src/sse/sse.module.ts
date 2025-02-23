import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  providers: [SseService],
  controllers: [SseController],
})
export class SseModule {}
