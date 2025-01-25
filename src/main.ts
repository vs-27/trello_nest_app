import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as multer from 'multer';
import { MainModule } from './modules/main/main.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');
  app.use(multer().none());
  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // Directory for your EJS files

  await app.listen(process.env.PORT ? process.env.PORT : 3000);
}
bootstrap();
