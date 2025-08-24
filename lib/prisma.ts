

import { PrismaClient } from '@prisma/client';
let prisma: PrismaClient;
if ((global as any).prisma) {
  prisma = (global as any).prisma;
} else {
  prisma = new PrismaClient({ log: ['query'] });
  if (process.env.NODE_ENV !== 'production') {
    (global as any).prisma = prisma;
  }
}
export { prisma };
