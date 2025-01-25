import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleStrategy {
  private tokenEndpoint = 'https://oauth2.googleapis.com/token';
  private userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';

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
      const response = await axios.post(this.tokenEndpoint, {
        code: authCode,
        client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
        client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.OAUTH_GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return response.data; // Returns the user's profile information
    } catch (error) {
      throw new Error(`Failed to retrieve user profile: ${error.message}`);
    }
  }
}
