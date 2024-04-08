import { PrismaClient, RoleEnum } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@grocery.com',
    },
    update: {
      name: 'Admin',
      password: '$2b$12$ZwpGuNErXpWaepgbLv0.guA6.B1kImLyUXVOnDZXfhUOViM0LsfoK',
      roles: {
        create: [
          {
            role: RoleEnum.USER,
          },
          {
            role: RoleEnum.ADMIN,
          },
        ],
      },
      cart: {
        create: {},
      },
    },
    create: {
      name: 'Admin',
      email: 'admin@grocery.com',
      password: '$2b$12$ZwpGuNErXpWaepgbLv0.guA6.B1kImLyUXVOnDZXfhUOViM0LsfoK',
      roles: {
        create: [
          {
            role: RoleEnum.USER,
          },
          {
            role: RoleEnum.ADMIN,
          },
        ],
      },
      cart: {
        create: {},
      },
    },
  });
  console.log('Admin : ', admin);
}

main()
  .then(async () => {
    prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    prisma.$disconnect();
  });
