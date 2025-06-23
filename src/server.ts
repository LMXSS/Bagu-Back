import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { initializeFirebase } from './firebase/firebase.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

initializeFirebase();

const server = express();

async function createNestServer(expressServer) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServer),
  );

  app.enableCors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
    // allowed headers
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Origin',
      'Accept',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
    ],
    // headers exposed to the client
    exposedHeaders: ['Authorization'],
    credentials: true, // Enable credentials (cookies, authorization headers) cross-origin
  });

  const config = new DocumentBuilder()
    .setTitle('Bucket API')
    .setDescription('Documentação da API NestJS usando Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  return app;
}

export { createNestServer, server as expressServer };
