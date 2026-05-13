import { Router } from 'express';
import {
  createLinkController,
  resolveLinkController,
  getRecentLinksController,
  getLinkAnalyticsController,
  getMyLinksController,
} from '../controllers/link.controller.js';
import { optionalAuthMiddleware } from '../middlewares/optionalAuth.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/links', optionalAuthMiddleware, createLinkController);
router.get('/links/recent', getRecentLinksController);
router.get(
  '/links/:shortCode/analytics',
  optionalAuthMiddleware,
  getLinkAnalyticsController,
);
router.get('/links/me', authMiddleware, getMyLinksController);
router.get('/:code', resolveLinkController);

export default router;
