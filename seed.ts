import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.tenant.create({
    data: {
      name: "Gabinet Testowy",
      users: {
        create: {
          email: "gabinet@example.com",
          clerkId: "mock-clerk-id"
        }
      }
    }
  });
}
main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
