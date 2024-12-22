import { type Prisma, PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.deleteMany({});
  const seedDataPath = join(__dirname, 'seedData.json');
  const seedData = JSON.parse(readFileSync(seedDataPath, 'utf-8')) as {
    employees: Prisma.EmployeeCreateInput[];
  };

  const tools: Prisma.EmployeeCreateInput[] = seedData.employees;

  await prisma.employee.createMany({ data: tools });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
