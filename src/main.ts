import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { port, swagger } from './configs';
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/login', method: RequestMethod.GET },
      { path: '/register', method: RequestMethod.GET },
      { path: '/dashboard', method: RequestMethod.GET },
    ],
  });

  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   // prefix: 'v1',
  // });

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('/swagger-docs', app, document);
  await app.listen(port, () => console.log(`app listen ${port} port`));
}
bootstrap();
