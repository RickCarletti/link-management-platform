import express from 'express';
import { healthCheck, dbHealthCheck } from '../controllers/health.controller';

const router = express.Router();

router.get('/health', healthCheck);
router.get('/health/db', dbHealthCheck);

export default router;