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
  await prisma.recipe.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.recipeIngredient.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  
  await prisma.role.create({
    data: { name: 'admin' }
  });

  await prisma.role.create({
    data: { name: 'viewer' }
  });

  const password = await hashPassword('admin');

  const user =await prisma.user.create({
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
  });

  await prisma.userRole.create({
    data: {
      user: { connect: { email: 'admin@example.com' } },
      role: { connect: { name: 'admin' } }
    }
  });

  await prisma.plan.createMany({
    data: [
      { name: 'Free', price: 0, currency: 'usd' },
      { name: 'Pro', price: 9.99, currency: 'usd' },
      { name: 'Premium', price: 19.99, currency: 'usd' },
    ]
  });

  await prisma.subscription.create({
    data: {
      user: { connect: { email: 'admin@example.com' } },
      plan: { connect: { name: 'Free' } }
    }
  });

  await prisma.ingredient.createMany({
    data: [
      { name: 'Spaghetti' },
      { name: 'Egg Yolk' },
      { name: 'Pancetta' },
      { name: 'Parmesan Cheese' },
      { name: 'Black Pepper' },
      { name: 'Salt' },
      { name: 'Pepper' },
      { name: 'Eggs' },
    ]
  });

  const ingredients = await prisma.ingredient.findMany();

  await prisma.recipe.create({
    data: {
      userId: user.id,
      name: 'Spaghetti Carbonara',
      description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
      steps: '1. Cook spaghetti. 2. Fry pancetta. 3. Mix eggs and cheese. 4. Combine all with pepper.',
      ingredients: {
        create: [
          { ingredient: { connect: { id: ingredients[0].id } }, quantity: 200, unit: 'grams' },
          { ingredient: { connect: { id: ingredients[1].id } }, quantity: 4, unit : 'units' },
          { ingredient: { connect: { id: ingredients[2].id } }, quantity: 100, unit : 'grams' },
          { ingredient: { connect: { id: ingredients[3].id } }, quantity: 50, unit: 'grams' },
          { ingredient: { connect: { id: ingredients[4].id } }, quantity: 1, unit: 'teaspoon' },
        ]
      }
    }
  });

  console.log('Seed completed! 🎸');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());