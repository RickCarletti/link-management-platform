import { createLink, resolveLink } from '../services/link.service.js';
import { prisma } from '../config/prisma.js';

describe('Link Service', () => {
  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.access.deleteMany();
    await prisma.link.deleteMany();
  });

  it('should create a link and generate audit log', async () => {
    const link = await createLink({
      originalUrl: 'https://google.com',
    });

    expect(link.shortCode).toBeDefined();

    const logs = await prisma.auditLog.findMany();

    expect(logs.length).toBe(1);
    expect(logs[0].action).toBe('CREATE');
    expect(logs[0].tableName).toBe('Link');
    expect(logs[0].recordId).toBe(link.id);
  });

  it('should resolve a link and log access', async () => {
    const link = await createLink({
      originalUrl: 'https://google.com',
    });

    const url = await resolveLink(link.shortCode, {
      ip: '127.0.0.1',
      userAgent: 'jest',
    });

    expect(url).toBe('https://google.com');

    const accesses = await prisma.access.findMany();
    expect(accesses.length).toBe(1);
  });

  it('should throw error if link not found', async () => {
    await expect(resolveLink('invalid', {})).rejects.toThrow('LINK_NOT_FOUND');
  });
});
