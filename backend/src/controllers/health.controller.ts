import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
  });
};

export const dbHealthCheck = async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
};
