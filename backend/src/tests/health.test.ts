import request from 'supertest';
import express from 'express';
import healthRoutes from '../routes/health.routes';

const app = express();
app.use(healthRoutes);

describe('Health Routes', () => {
  it('should return 200 on /health', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should return DB status on /health/db', async () => {
    const res = await request(app).get('/health/db');

    expect(res.status).toBe(200);
    expect(res.body.database).toBe('connected');
  });
});