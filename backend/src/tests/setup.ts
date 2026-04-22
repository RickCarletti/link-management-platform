import { prisma } from '../config/prisma.js';

afterAll(async () => {
  await prisma.$disconnect();
});
