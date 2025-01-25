import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  static generateRandomString(input: string, length = 16, random = true): string {
    const salt = random ? Date.now().toString() : process.env.APP_HASH;
    
    const hash = crypto.createHash('sha256').update(`${input}_${salt}`).digest('hex');
    
    return hash.slice(0, length);
  }
}
