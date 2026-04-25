import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from './auth.middleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    req.user = decoded;
  } catch (err) {
    // apenas ignora token inválido
  }

  return next();
};
