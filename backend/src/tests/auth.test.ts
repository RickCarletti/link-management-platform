import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import { prisma } from '../config/prisma.js';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth - Register', () => {
  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should register a user', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('ricardo@test.com');
    expect(res.body.password).toBeUndefined();
  });

  it('should not allow duplicate email', async () => {
    await request(app).post('/auth/register').send({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    const res = await request(app).post('/auth/register').send({
      name: 'Outro',
      email: 'ricardo@test.com',
      password: '123456',
    });

    expect(res.status).toBe(409);
  });

  it('should validate required fields', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'test@test.com',
    });

    expect(res.status).toBe(400);
  });

  it('should login successfully', async () => {
    await request(app).post('/auth/register').send({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'ricardo@test.com',
      password: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    await request(app).post('/auth/register').send({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'ricardo@test.com',
      password: 'wrong',
    });

    expect(res.status).toBe(401);
  });

  it('should reject non-existing user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'notfound@test.com',
      password: '123456',
    });

    expect(res.status).toBe(401);
  });

  it('should validate required fields', async () => {
    const res = await request(app).post('/auth/login').send({});

    expect(res.status).toBe(400);
  });
});
