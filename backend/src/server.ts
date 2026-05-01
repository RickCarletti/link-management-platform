import express from 'express';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import protectedRoutes from './routes/protected.routes.js';
import linkRoutes from './routes/link.routes.js';
import { resolveLinkController } from './controllers/link.controller.js';
import cors from 'cors';

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', linkRoutes);
app.use('/loaderio-3292611a424973d09cf2fc5e34949059', (req, res) => {
  res.send('loaderio-3292611a424973d09cf2fc5e34949059');
});
app.get('/:code', resolveLinkController);

app.listen(3000);
