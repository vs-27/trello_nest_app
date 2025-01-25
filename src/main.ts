import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as multer from 'multer';
import { MainModule } from './modules/main/main.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);
  
  app.setBaseViewsDir(join(process.cwd(), 'src/modules'));
  app.setViewEngine('ejs');

  app.useStaticAssets(join(process.cwd(), 'public'));
  
  app.use(multer().none());
  
  await app.listen(PORT);

  console.log(`Application is running on: http://localhost:${PORT}`);
}

bootstrap();
