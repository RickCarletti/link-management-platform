import { Request, Response } from 'express';
import { createLink } from '../services/link.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const createLinkController = async (req: AuthRequest, res: Response) => {
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({
        message: 'Invalid URL',
      });
    }

    const userId = req.user?.userId; // caso já tenha auth middleware

    const link = await createLink({
      originalUrl: url,
        userId,
    });

    const shortUrl = `${req.protocol}://${req.get('host')}/${link.shortCode}`;

    return res.status(201).json({
      shortUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create link',
    });
  }
};
