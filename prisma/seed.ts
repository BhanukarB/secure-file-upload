// prisma/seed.ts

// This script will seed the database with the initial user.

// RUN this command to seed a used(creating initial user : npx ts-node prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
    },
  });

  console.log('User seeded');
}

main().finally(() => prisma.$disconnect());
