import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import { prisma } from '../config/prisma.js';
import protectedRoutes from '../routes/protected.routes.js';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

describe('Auth - Middleware', () => {
  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should access protected route with valid token', async () => {
    await request(app).post('/auth/register').send({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    const login = await request(app).post('/auth/login').send({
      email: 'ricardo@test.com',
      password: '123456',
    });

    const token = login.body.token;

    const res = await request(app)
      .get('/protected/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it('should fail without token', async () => {
    const res = await request(app).get('/protected/me');

    expect(res.status).toBe(401);
  });

  it('should fail with invalid token', async () => {
    const res = await request(app)
      .get('/protected/me')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.status).toBe(401);
  });
});
