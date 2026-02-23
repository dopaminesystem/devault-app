import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || (() => {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
