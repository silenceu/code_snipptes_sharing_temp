import 'dotenv/config';
import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors();

  app.useLogger(app.get(Logger));

  // OpenAPI Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${process.env.SERVICE_NAME}`)
    .setDescription(`The ${process.env.SERVICE_NAME} API documentation`)
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDoc);

  // init websocket
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.HTTP_PORT);
}

bootstrap();
