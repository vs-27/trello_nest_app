import { Request } from 'express';
import { UserEntity } from '../entities/user.entity';

export interface ExpressRequestInterface extends Request {
  user?: UserEntity;
}
