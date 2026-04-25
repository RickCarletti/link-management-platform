import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import linkRoutes from '../routes/link.routes.js';
import { prisma } from '../config/prisma.js';

const app = express();
app.use(express.json());
app.use('/api', linkRoutes);

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

describe('POST /links', () => {
  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.access.deleteMany();
    await prisma.link.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should create a shortened link (anonymous user)', async () => {
    const res = await request(app)
      .post('/api/links')
      .send({ url: 'https://google.com' });

    expect(res.status).toBe(201);
    expect(res.body.shortUrl).toBeDefined();

    const link = await prisma.link.findFirst();
    expect(link?.userId).toBeNull();
  });

  it('should create a shortened link (authenticated user)', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Ricardo',
        email: 'ricardo@test.com',
        password: '123456',
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'https://google.com' });

    expect(res.status).toBe(201);
    expect(res.body.shortUrl).toBeDefined();

    const link = await prisma.link.findFirst();
    expect(link?.userId).toBe(user.id);
  });

  it('should return 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/api/links')
      .send({ url: 'invalid-url' });

    expect(res.status).toBe(400);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});