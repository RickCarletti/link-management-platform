import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  return res.json({
    user: req.user,
  });
});

export default router;
