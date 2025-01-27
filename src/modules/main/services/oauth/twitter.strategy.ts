import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { URLSearchParams } from 'url';
import crypto from 'crypto';

@Injectable()
export class TwitterStrategy {
  private tokenEndpoint = 'https://api.twitter.com/2/oauth2/token';
  private userInfoEndpoint = 'https://api.twitter.com/2/users/me';
  private stateStore = new Map<string, string>();

  generateState(): string {
    const state = crypto.randomBytes(16).toString('hex');
    this.stateStore.set(state, 'valid');
    console.log(state);
    return state;
  }

  validateState(state: string): boolean {
    if (this.stateStore.has(state)) {
      this.stateStore.delete(state);
      return true;
    }
    return false;
  }

  async processAuthCode(authCode: string, state: string): Promise<any> {
    if (!this.validateState(state)) {
      throw new Error('Invalid state value. Potential CSRF attack detected.');
    }

    try {
      const tokensData = await this.getTokensData(authCode);
      const profile = await this.getUserProfile(tokensData.access_token);

      return { tokensData, profile };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getTokensData(authCode: string): Promise<any> {
    try {
      const response = await axios.post(
        this.tokenEndpoint,
        new URLSearchParams({
          code: authCode,
          client_id: process.env.OAUTH_TWITTER_CLIENT_ID,
          client_secret: process.env.OAUTH_TWITTER_CLIENT_SECRET,
          redirect_uri: process.env.OAUTH_TWITTER_REDIRECT_URL,
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to retrieve tokens: ${error.response?.data || error.message}`);
    }
  }

  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(this.userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to retrieve user profile: ${error.response?.data || error.message}`);
    }
  }

  getTwitterAuthUrl(): string {
    const clientId = process.env.OAUTH_TWITTER_CLIENT_ID;
    const redirectUri = process.env.OAUTH_TWITTER_REDIRECT_URL;
    const state = this.generateState();

    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read users.read offline.access',
      state,
      code_challenge: 'your-code-challenge',
      code_challenge_method: 'plain',
    });

    return `https://twitter.com/i/oauth2/authorize?${queryParams.toString()}`;
  }
}
