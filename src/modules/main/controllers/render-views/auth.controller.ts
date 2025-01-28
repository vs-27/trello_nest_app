import { Controller, Get, Res, Query, Render } from '@nestjs/common';
import { Response } from 'express';
import * as querystring from 'querystring';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from '../../dto/user.dto';
import { CookieService } from '../../services/cookie.service';
import { FacebookStrategy } from '../../services/oauth/facebook.strategy';
import { GoogleStrategy } from '../../services/oauth/google.strategy';
import { TwitterStrategy } from '../../services/oauth/twitter.strategy';
import { UserService } from '../../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly googleStrategy: GoogleStrategy,
    private readonly facebookStrategy: FacebookStrategy,
    private readonly twitterStrategy: TwitterStrategy,
    private readonly userService: UserService,
    private readonly cookieService: CookieService,
  ) {}

  @Get('login')
  @Render('main/views/login/login')
  getLoginPage(@Res() res: Response) {
    return {
      title: 'Login page!',
      oauth: {
        google: {
          url: this.getGoogleAuthUrl(),
        },
        facebook: {
          url: this.getFacebookAuthUrl(),
        },
        twitter: {
          url: this.getTwitterAuthUrl(),
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

    const dto = new CreateUserDto();
    dto.email = profile.email;
    dto.firstName = profile.given_name;
    dto.lastName = profile.family_name;

    const { JWT } = await this.userService.processOauth(dto, { tokensData, profile });

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

  @Get('facebook/redirect')
  async facebookAuthRedirect(
    @Query() { code },
    @Res() res: Response
    ) {
    const { tokensData, profile } = await this.facebookStrategy.processAuthCode(code);

    const dto = new CreateUserDto();
    dto.email = profile.email;
    dto.firstName = profile.first_name;
    dto.lastName = profile.last_name;

    const { JWT } = await this.userService.processOauth(dto, { tokensData, profile });

    this.cookieService.setCookie(res, 'APP_JWT', JWT);

    res.redirect('/auth/login');//todo: change that redirect to some dashboard page when will be created
  }

  private getFacebookAuthUrl(): string {
    const clientId = process.env.OAUTH_FACEBOOK_CLIENT_ID;
    const redirectUri = process.env.OAUTH_FACEBOOK_REDIRECT_URL;

    const facebookAuthUrl = 'https://www.facebook.com/v17.0/dialog/oauth';

    const queryParams = querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email public_profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${facebookAuthUrl}?${queryParams}`;
  }



  @Get('twitter/redirect')
  async twitterAuthRedirect(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    const { tokensData, profile } = await this.twitterStrategy.processAuthCode(code, state);

    console.log(profile);
    console.log(tokensData);

    const dto = new CreateUserDto();
    dto.email = profile.email;
    dto.firstName = profile.given_name;
    dto.lastName = profile.family_name;

    const { JWT } = await this.userService.processOauth(dto, { tokensData, profile });

    this.cookieService.setCookie(res, 'APP_JWT', JWT);

    res.redirect('/auth/login');//todo: change that redirect to some dashboard page when will be created
  }

  private getTwitterAuthUrl(): string {
    const clientId = process.env.OAUTH_TWITTER_CLIENT_ID;
    const redirectUri = process.env.OAUTH_TWITTER_REDIRECT_URL;

    const twitterAuthUrl = 'https://twitter.com/i/oauth2/authorize';

    const queryParams = querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read users.read offline.access',
      state: 'your-unique-state',
      code_challenge: 'your-code-challenge',
      code_challenge_method: 'plain',
    });

    return `${twitterAuthUrl}?${queryParams}`;
  }
}
