import { Router } from 'express';
import {
  createLinkController,
  resolveLinkController,
  getRecentLinksController,
} from '../controllers/link.controller.js';
import { optionalAuthMiddleware } from '../middlewares/optionalAuth.middleware.js';

const router = Router();

router.post('/links', optionalAuthMiddleware, createLinkController);
router.get('/links/recent', getRecentLinksController);
router.get('/:code', resolveLinkController);

export default router;
