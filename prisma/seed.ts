import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@local.test' },
    update: {},
    create: {
      email: 'demo@local.test',
      name: 'Demo User',
    },
  });

  await prisma.category.createMany({
    data: [{ name: 'Food' }, { name: 'Transport' }, { name: 'Bills' }],
    skipDuplicates: true,
  });

  console.log('Seeding done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
