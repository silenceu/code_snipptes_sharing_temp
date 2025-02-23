import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  // 安全策略
  app.use(helmet());

  // 允许跨域
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
