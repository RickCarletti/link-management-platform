import express from 'express';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import protectedRoutes from './routes/protected.routes.js';
import linkRoutes from './routes/link.routes.js';

const app = express();

app.use(express.json());

app.use(healthRoutes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', linkRoutes);

app.listen(3000, () => {
  console.log('Server running');
});
