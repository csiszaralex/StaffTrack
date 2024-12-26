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
  const employees = seedData.employees;

  await prisma.user.createMany({ data: users });
  await prisma.employee.createMany({ data: employees });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
