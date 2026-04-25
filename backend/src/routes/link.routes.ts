import { Router } from 'express';
import {
  createLinkController,
  resolveLinkController,
} from '../controllers/link.controller.js';
import { optionalAuthMiddleware } from '../middlewares/optionalAuth.middleware.js';

const router = Router();

router.post('/links', optionalAuthMiddleware, createLinkController);
router.get('/:code', resolveLinkController);

export default router;
