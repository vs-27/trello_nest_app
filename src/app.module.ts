import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './main/controllers/render-views/auth.controller';
import { MainModule } from './main/main.module';
import { AuthMiddleware } from './main/middlewares/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options), MainModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
