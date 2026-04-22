import { prisma } from '../config/prisma.js';

export const createAuditLog = async (
  {
    tableName,
    recordId,
    action,
    oldData,
    newData,
  }: {
    tableName: string;
    recordId: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    oldData?: any;
    newData?: any;
  },
  tx?: any,
) => {
  const client = tx ?? prisma;

  await client.auditLog.create({
    data: {
      tableName,
      recordId,
      action,
      oldData,
      newData,
    },
  });
};
