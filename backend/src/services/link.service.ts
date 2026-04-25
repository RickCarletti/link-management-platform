import { prisma } from '../config/prisma.js';

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

const generateUniqueShortCode = async (): Promise<string> => {
  const MAX_ATTEMPTS = 10;
  let attempts = 0;
  let code = generateShortCode();

  let exists = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  while (exists && attempts < MAX_ATTEMPTS) {
    code = generateShortCode();
    attempts++;

    exists = await prisma.link.findUnique({
      where: { shortCode: code },
    });
  }

  if (exists) {
    throw new Error('FAILED_TO_GENERATE_UNIQUE_SHORT_CODE');
  }

  return code;
};

export const createLink = async (data: {
  originalUrl: string;
  userId?: string;
}) => {
  try {
    const shortCode = await generateUniqueShortCode();

    return await prisma.$transaction(async (tx) => {
      const link = await tx.link.create({
        data: {
          originalUrl: data.originalUrl,
          shortCode,
          userId: data.userId,
        },
      });

      await tx.auditLog.create({
        data: {
          tableName: 'Link',
          recordId: link.id,
          action: 'CREATE',
          newData: link,
          userId: data.userId,
        },
      });

      return link;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`FAILED_TO_CREATE_LINK: ${error.message}`);
    }
    throw new Error('FAILED_TO_CREATE_LINK');
  }
};

export const resolveLink = async (
  code: string,
  metadata: { ip?: string; userAgent?: string },
) => {
  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    throw new Error('LINK_NOT_FOUND');
  }

  await prisma.access.create({
    data: {
      linkId: link.id,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    },
  });

  return link.originalUrl;
};