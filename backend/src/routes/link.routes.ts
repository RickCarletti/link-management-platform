import { Router } from 'express';
import { createLinkController } from '../controllers/link.controller.js';
import { optionalAuthMiddleware } from '../middlewares/optionalAuth.middleware.js';

const router = Router();

router.post('/links', optionalAuthMiddleware, createLinkController);

export default router;
