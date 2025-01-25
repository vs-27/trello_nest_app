import { Controller, Get, Res, Query, Render } from '@nestjs/common';
import { Response } from 'express';
import * as querystring from 'querystring';
import { HttpService } from '@nestjs/axios';
import { CookieService } from '../../services/cookie.service';
import { GoogleStrategy } from '../../services/oauth/google.strategy';
import { UserService } from '../../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly googleStrategy: GoogleStrategy,
    private readonly userService: UserService,
    private readonly cookieService: CookieService,
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
  async googleAuthRedirect(
    @Query() { code },
    @Res() res: Response
    ) {
    const { tokensData, profile } = await this.googleStrategy.processAuthCode(code);
    const { JWT } = await this.userService.processOauth(tokensData, profile);
    
    this.cookieService.setCookie(res, 'APP_JWT', JWT);
  
    res.redirect('/auth/login');//todo: change that redirect to some dashboard page when will be created
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
