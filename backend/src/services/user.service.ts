import { prisma } from '../config/prisma.js';
import { createAuditLog } from './audit.service.js';
import { hashPassword } from '../utils/password.js';

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await tx.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    await createAuditLog(
      {
        tableName: 'User',
        recordId: user.id,
        action: 'CREATE',
        newData: user,
      },
      tx,
    );

    return user;
  });
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; password: string }>,
) => {
  return prisma.$transaction(async (tx) => {
    const oldUser = await tx.user.findUnique({
      where: { id },
    });

    if (!oldUser) {
      throw new Error('User not found');
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const updatedUser = await tx.user.update({
      where: { id },
      data,
    });

    await createAuditLog(
      {
        tableName: 'User',
        recordId: id,
        action: 'UPDATE',
        oldData: oldUser,
        newData: updatedUser,
      },
      tx,
    );

    return updatedUser;
  });
};

export const deleteUser = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    const oldUser = await tx.user.findUnique({
      where: { id },
    });

    if (!oldUser) {
      throw new Error('User not found');
    }

    await tx.user.delete({
      where: { id },
    });

    await createAuditLog(
      {
        tableName: 'User',
        recordId: id,
        action: 'DELETE',
        oldData: oldUser,
      },
      tx,
    );

    return true;
  });
};
