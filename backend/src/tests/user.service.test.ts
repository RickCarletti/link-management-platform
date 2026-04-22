import { prisma } from '../config/prisma.js';
import {
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.service.js';

describe('User Service', () => {
  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should create a user', async () => {
    const user = await createUser({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('ricardo@test.com');

    const audit = await prisma.auditLog.findMany();
    expect(audit.length).toBe(1);
    expect(audit[0].action).toBe('CREATE');
  });

  it('should not allow duplicate email', async () => {
    await createUser({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    await expect(
      createUser({
        name: 'Outro',
        email: 'ricardo@test.com',
        password: '123456',
      }),
    ).rejects.toThrow('Email already in use');
  });

  it('should update a user', async () => {
    const user = await createUser({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    const updated = await updateUser(user.id, {
      name: 'Rick',
    });

    expect(updated.name).toBe('Rick');

    const audit = await prisma.auditLog.findMany({
      where: { action: 'UPDATE' },
    });

    expect(audit.length).toBe(1);
  });

  it('should delete a user', async () => {
    const user = await createUser({
      name: 'Ricardo',
      email: 'ricardo@test.com',
      password: '123456',
    });

    const result = await deleteUser(user.id);

    expect(result).toBe(true);

    const found = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(found).toBeNull();

    const audit = await prisma.auditLog.findMany({
      where: { action: 'DELETE' },
    });

    expect(audit.length).toBe(1);
  });
});
