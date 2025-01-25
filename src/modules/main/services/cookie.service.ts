import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class CookieService {
  /**
   * Set a cookie
   * @param res - The Express response object
   * @param name - The name of the cookie
   * @param value - The value of the cookie
   * @param options - Additional cookie options (e.g., httpOnly, secure)
   */
  setCookie(res: Response, name: string, value: string, options: Record<string, any> = {}): void {
    res.cookie(name, value, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: false, // Set to true if using HTTPS
      sameSite: 'strict', // Prevent cross-site request forgery
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds by default
      ...options, // Allow overriding defaults
    });
  }
  
  /**
   * Get a cookie
   * @param req - The Express request object
   * @param name - The name of the cookie
   * @returns The value of the cookie or undefined if not found
   */
  getCookie(req: Request, name: string): string | undefined {
    return req.cookies ? req.cookies[name] : undefined;
  }
  
  /**
   * Clear a cookie
   * @param res - The Express response object
   * @param name - The name of the cookie
   * @param options - Additional cookie options (e.g., path)
   */
  clearCookie(res: Response, name: string, options: Record<string, any> = {}): void {
    res.clearCookie(name, { ...options });
  }
}
