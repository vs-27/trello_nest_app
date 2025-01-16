import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('auth')
export class AuthController {
  @Get('login')
  getLoginPage(@Res() res: Response) {
    const loginPagePath = join(process.cwd(), 'views', 'login', 'login.html');
    res.sendFile(loginPagePath);
  }
}
