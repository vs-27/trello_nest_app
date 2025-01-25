import { Controller, Get, Res, Query, Render } from '@nestjs/common';
import { Response } from 'express';
import * as querystring from 'querystring';
import { HttpService } from '@nestjs/axios';
import { GoogleStrategy } from '../../services/oauth/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly googleStrategy: GoogleStrategy,
  ) {}

  @Get('login')
  @Render('main/views/login/login')
  getLoginPage(@Res() res: Response) {
    return {
      title: 'Login page!',
      ouath: {
        google: {
          url: this.getGoogleAuthUrl(),
        }
      }
    };
  }
  
  @Get('google/redirect')
  async googleAuthRedirect(@Query() { code }) {
    const { tokensData, profile } = await this.googleStrategy.processAuthCode(code);
    return {
      message: 'Google OAuth Successful',
    };
  }
  
  private getGoogleAuthUrl(): string {
    const clientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.OAUTH_GOOGLE_REDIRECT_URL;
    
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    const queryParams = querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    
    return `${googleAuthUrl}?${queryParams}`;
  }
}
