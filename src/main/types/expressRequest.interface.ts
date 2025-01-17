import { Request } from 'express';
import { User } from '../entities/user.entity';

export interface ExpressRequestInterface extends Request {
  user?: User;
}
