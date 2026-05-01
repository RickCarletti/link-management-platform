import express from 'express';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import protectedRoutes from './routes/protected.routes.js';
import linkRoutes from './routes/link.routes.js';
import { resolveLinkController } from './controllers/link.controller.js';
import cors from 'cors';

const app = express();

app.set('trust proxy', '127.0.0.1');
app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', linkRoutes);
app.get('/:code', resolveLinkController);

app.listen(3000, '127.0.0.1');
