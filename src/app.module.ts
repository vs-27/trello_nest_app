import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './main/controllers/render-views/auth.controller';
import { MainModule } from './main/main.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options), MainModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
