import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomePageModule } from './home-page/home-page.module';
import { LoggerMiddleware } from './untis/middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HomePageModule, TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
