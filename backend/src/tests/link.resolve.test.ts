import request from 'supertest';
import express from 'express';
import linkRoutes from '../routes/link.routes.js';
import { prisma } from '../config/prisma.js';
import { createLink } from '../services/link.service.js';

const app = express();
app.use(express.json());
app.use('/', linkRoutes);

describe('GET /:code', () => {
  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.access.deleteMany();
    await prisma.link.deleteMany();
  });

  it('should redirect to original URL and log access', async () => {
    const link = await createLink({
      originalUrl: 'https://google.com',
    });

    const res = await request(app).get(`/${link.shortCode}`);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://google.com');

    const accesses = await prisma.access.findMany();
    expect(accesses.length).toBe(1);
    expect(accesses[0].linkId).toBe(link.id);
    expect(accesses[0].ip).toBeDefined();
    expect(accesses[0].userAgent).toBeDefined();
  });

  it('should return 404 for invalid code', async () => {
    const res = await request(app).get('/invalidcode');

    expect(res.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
