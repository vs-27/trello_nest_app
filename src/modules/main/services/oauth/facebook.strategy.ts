import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FacebookStrategy {
  private tokenEndpoint = 'https://graph.facebook.com/v12.0/oauth/access_token';
  private userInfoEndpoint = 'https://graph.facebook.com/me';

  async processAuthCode(authCode: string): Promise<any> {
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
      const response = await axios.get(this.tokenEndpoint, {
        params: {
          code: authCode,
          client_id: process.env.OAUTH_FACEBOOK_CLIENT_ID,
          client_secret: process.env.OAUTH_FACEBOOK_CLIENT_SECRET,
          redirect_uri: process.env.OAUTH_FACEBOOK_REDIRECT_URL,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to retrieve tokens: ${error.message}`);
    }
  }

  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(this.userInfoEndpoint, {
        params: {
          fields: 'id,name,email,first_name,last_name,picture',
          access_token: accessToken,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to retrieve user profile: ${error.message}`);
    }
  }
}
