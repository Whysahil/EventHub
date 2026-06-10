import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ override: true });

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

// Avoid multiple Prisma instances in dev mode
const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
