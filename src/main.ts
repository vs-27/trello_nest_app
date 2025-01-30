import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as ejs from 'ejs';
import * as express from 'express';
import { MainModule } from './modules/main/main.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  app.setBaseViewsDir(join(process.cwd(), 'src/modules'));
  app.setViewEngine('ejs');

  app.useStaticAssets(join(process.cwd(), 'public'));

  addDumper(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await app.listen(PORT);

  console.log(`Application is running on: http://localhost:${PORT}`);
}

function addDumper(app) {
  app.use((req, res, next) => {
    res.locals.dump = (data: any) => {
      return `
        <pre style="
            background: #1e1e1ef5;
            color: #ffffff;
            padding: 10px;
            border-radius: 5px;
            font-family: Consolas, Monaco, 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            line-height: 1.5;
            position: fixed;
            z-index: 99999;
            width: 80%;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            height: 80%;
            margin: auto;
        ">${JSON.stringify(data, null, 2)}</pre>
      `;
    };
    next();
  });
}

bootstrap();
