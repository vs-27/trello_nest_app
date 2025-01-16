import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/render-views/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
