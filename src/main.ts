import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true, 
        whitelist: true, 
        forbidNonWhitelisted: false,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    )
    const config = new DocumentBuilder()
    .setTitle('EventHub API')
    .setDescription('API для управления событиями, категориями и регистрациями')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .addTag('events', 'События')
    .addTag('categories', 'Категории')
    .addTag('auth', 'Авторизация')
    .addTag('registrations', 'Регистрации')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'EventHub API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Swagger: http://localhost:3000/api/docs');
  
}
bootstrap();
