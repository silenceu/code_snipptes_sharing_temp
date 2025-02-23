import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from '@nestjs-modules/ioredis';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SseModule } from './sse/sse.module';
import { WsModule } from './ws/ws.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    LoggerModule.forRoot({}),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    RedisModule.forRoot(
      {
        type: 'single',
        url: process.env.REDIS_URL,
      },
      'subscribe',
    ),
    RedisModule.forRoot(
      {
        type: 'single',
        url: process.env.REDIS_URL,
      },
      'publish',
    ),
    OrderModule,
    SseModule,
    WsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
      exclude: ['/', '/order/(.*)', '/sse/(.*)', '/api/(.*)', '/ws/(.*)'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
