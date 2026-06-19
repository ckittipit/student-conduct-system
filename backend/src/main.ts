import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.use(helmet())

  app.enableCors({
    origin: config.get('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  app.setGlobalPrefix('api/v1')

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Conduct Points API')
    .setVersion('1.0')
    .addBearerAuth().build()
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig))

  await app.listen(config.get('PORT', 4000))
  console.log(`🚀 http://localhost:${config.get('PORT', 4000)}`);
}

bootstrap()