import request from 'supertest';
import express from 'express';
import linkRoutes from '../routes/link.routes.js';
import { prisma } from '../config/prisma.js';
import { createLink } from '../services/link.service.js';
import { resolveLinkController } from '../controllers/link.controller.js';

const app = express();

app.use(express.json());
app.use('/api', linkRoutes);
app.get('/:code', resolveLinkController);

describe('GET /api/links/:shortCode/analytics', () => {
  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.access.deleteMany();
    await prisma.link.deleteMany();
  });

  it('should return analytics for a valid shortCode', async () => {
    const link = await createLink({
      originalUrl: 'https://google.com',
    });

    await request(app).get(`/${link.shortCode}`);
    await request(app).get(`/${link.shortCode}`);

    const res = await request(app).get(
      `/api/links/${link.shortCode}/analytics`
    );

    expect(res.status).toBe(200);

    expect(res.body.shortCode).toBe(link.shortCode);
    expect(res.body.originalUrl).toBe('https://google.com');
    expect(res.body.accesses).toBeDefined();
    expect(res.body.accesses.length).toBe(2);
  });

  it('should return 404 when link does not exist', async () => {
    const res = await request(app).get(
      '/api/links/invalidcode/analytics'
    );

    expect(res.status).toBe(404);
  });

  it('should return accesses with geo data', async () => {
    const link = await createLink({
      originalUrl: 'https://google.com',
    });

    await request(app)
      .get(`/${link.shortCode}`)
      .set('X-Forwarded-For', '8.8.8.8');

    const res = await request(app).get(
      `/api/links/${link.shortCode}/analytics`
    );

    expect(res.status).toBe(200);
    expect(res.body.accesses.length).toBe(1);

    const access = res.body.accesses[0];

    expect(access.country).toBeDefined();
    expect(access.city).toBeDefined();
    expect(access.lat).toBeDefined();
    expect(access.lon).toBeDefined();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});