import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env para o process.env
dotenv.config({ quiet: true });

// Verifica se a variável existe para evitar erros silenciosos
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não encontrada no arquivo .env');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
