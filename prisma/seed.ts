import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
}

async function main(): Promise<void> {
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  
  await prisma.role.create({
    data: { name: 'admin' }
  });

  await prisma.role.create({
    data: { name: 'viewer' }
  });

  const password = await hashPassword('admin');

  await prisma.user.create({
    data: {
        name: 'Admin User',
        email: 'admin@example.com',
        username: 'admin',
        password,
        roles: {
            create: [
                { role: { connect: { name: 'admin' } } }
            ]
        }
    }
  })

  console.log('Seed completed! 🎸');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());