import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new FastifyAdapter(), { logger: false });
    const config = new DocumentBuilder()
      .setTitle('HotStock API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('swagger-spec.json', JSON.stringify(document, null, 2));
    console.log('Swagger spec generated at swagger-spec.json');
    await app.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
bootstrap();