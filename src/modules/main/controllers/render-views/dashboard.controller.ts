import { Controller, Get, Res, Render } from '@nestjs/common';
import { Response } from 'express';

@Controller('dashboard')
export class DashboardController {
  @Get('/')
  @Render('main/views/dashboard/dashboard')
  getLoginPage(@Res() res: Response) {
    return {
      title: 'Dashboard page!',
    };
  }
}
