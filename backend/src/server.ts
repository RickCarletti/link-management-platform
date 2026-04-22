import express from 'express';
import healthRoutes from './routes/health.routes.js';

const app = express();

app.use(express.json());

app.use(healthRoutes);

app.listen(3000, () => {
  console.log('Server running');
});
