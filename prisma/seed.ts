import { type Prisma, PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.deleteMany({});
  const seedDataPath = join(__dirname, 'seedData.json');
  const seedData = JSON.parse(readFileSync(seedDataPath, 'utf-8')) as {
    users: Prisma.UserCreateInput[];
    employees: Prisma.EmployeeCreateManyInput[];
    permissions: Prisma.PermissionCreateInput[];
  };

  const users = await Promise.all(
    seedData.users.map(async user => {
      const salt = genSaltSync();
      return {
        ...user,
        password: hashSync(user.password, salt),
        salt: salt,
      };
    }),
  );

  await prisma.user.createMany({ data: users });
  await prisma.employee.createMany({ data: seedData.employees });
  await prisma.permission.createMany({ data: seedData.permissions });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
