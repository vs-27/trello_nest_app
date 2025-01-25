import { Controller, Get, Res, Req, Query, UseGuards, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import * as querystring from 'querystring';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('login')
  getLoginPage(@Res() res: Response) {
    const loginPagePath = join(process.cwd(), 'views', 'login', 'login.html');
    res.sendFile(loginPagePath);
  }

  @Get('google')
  @UseGuards(AuthGuard('google')) // Uses the Google strategy
  async googleAuth() {
    // This route is only for redirecting users to Google
    return 'Redirecting to Google for authentication...';
  }

  // Step 2: Handles the redirect from Google after authentication
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // The user information from Google will be available here
    return {
      message: 'Google OAuth Successful',
      user: req.user, // The user details returned from GoogleStrategy's validate method
    };
  }

  // Renders the index page with the Google OAuth button
  @Get()
  @Render('index') // Renders the 'index.ejs' file
  root() {
    return {}; // Pass data if needed (e.g., dynamic messages)
  }



  // REST endpoint to return Google OAuth login URL
  @Get('google/url')
  async getGoogleAuthUrl() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');

    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const queryParams = querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return { url: `${googleAuthUrl}?${queryParams}` };
  }



  @Get('google/callback')
  async handleGoogleCallback(@Query('code') code: string) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');

    const tokenUrl = 'https://oauth2.googleapis.com/token';

    // Exchange code for tokens
    const tokenResponse = await lastValueFrom(
      this.httpService.post(tokenUrl, {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    );

    const tokens = tokenResponse.data;

    // Fetch user information
    const userInfoResponse = await lastValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }),
    );

    const userInfo = userInfoResponse.data;

    return {
      message: 'Google OAuth successful',
      user: userInfo,
      tokens,
    };
  }


}
