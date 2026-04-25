import { Request, Response } from 'express';
import { createLink, getRecentLinks, resolveLink } from '../services/link.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const resolveLinkController = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'];

    const originalUrl = await resolveLink(
      Array.isArray(code) ? code[0] : code,
      {
        ip,
        userAgent,
      },
    );

    // redirect real para a URL original
    return res.redirect(302, originalUrl);

    // alternativa sem redirecionamento, apenas retornando a URL original
    // return res.status(200).json({ url: originalUrl });
  } catch (error) {
    if (error instanceof Error && error.message === 'LINK_NOT_FOUND') {
      return res.status(404).json({
        message: 'Link not found',
      });
    }

    return res.status(500).json({
      message: 'Failed to resolve link',
    });
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

export const getRecentLinksController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // Não vai usar os usuarios, só para pegar todos os links recentes,
    // const userId = req.user?.userId; // caso já tenha auth middleware

    const recentLinks = await getRecentLinks();

    return res.status(200).json(recentLinks);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch recent links',
    });
  }
};
