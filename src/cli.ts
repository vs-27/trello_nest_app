import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { MainModule } from './modules/main/main.module';

async function bootstrap () {
  const app = await NestFactory.createApplicationContext(MainModule, {
    logger: ['error'],
  });

  try {
    await app
      .select(CommandModule)
      .get(CommandService)
      .exec();
    await app.close();
  } catch (error) {
    console.trace(error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
