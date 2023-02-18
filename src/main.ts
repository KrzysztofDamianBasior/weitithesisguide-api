import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('WeitiThesisGuide api')
    .setDescription('WeitiThesisGuide API description')
    .setVersion('0.0')
    .addTag('users')
    .addTag('posts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
