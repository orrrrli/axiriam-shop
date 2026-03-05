import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hash = await bcrypt.hash('admin123', 10);
const user = await prisma.user.upsert({
  where: { email: 'admin@axiriam.com' },
  update: {},
  create: {
    name: 'Admin',
    email: 'admin@axiriam.com',
    password: hash,
    role: 'admin',
  },
});

console.log('✓ Usuario creado:', user.email, '| role:', user.role);
await prisma.$disconnect();
