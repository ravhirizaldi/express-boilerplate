import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import logger from '../utils/logger.js';

/** @type {import('@prisma/client').PrismaClient} */
let prisma;

if (!global.prisma) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
  global.prisma = prisma;
} else {
  prisma = global.prisma;
}

logger.info('✅ Prisma client initialized');

export default prisma;
