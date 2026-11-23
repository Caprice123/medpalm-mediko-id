import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
    transactionOptions: {
        // Default Prisma budget is 2s wait / 5s timeout, which is too tight for
        // large records (e.g. a big summary note's content blob) read inside a
        // transaction. Raised globally; individual $transaction calls can still
        // pass their own options to override these.
        maxWait: parseInt(process.env.PRISMA_TRANSACTION_MAX_WAIT || '10000'),
        timeout: parseInt(process.env.PRISMA_TRANSACTION_TIMEOUT || '30000'),
    },
});

export default prisma;
