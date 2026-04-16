import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { requireEnv } from '../config/env';

const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const decoded: jwt.JwtPayload | string = jwt.verify(token, requireEnv('JWT_SECRET'));

    if (!decoded) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    req.body.email = (decoded as jwt.JwtPayload).email;
    next();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Missing required environment variable')) {
      console.error(error.message);
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    res.status(401).json({ error: 'Unauthorized' });
  }
}

export default userMiddleware;
