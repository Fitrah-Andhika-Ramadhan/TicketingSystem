const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.systemSettings.update({
    where: { id: 'default-settings' },
    data: { phone: '081289886013' }
  });
  console.log('Done');
}
main().finally(() => prisma.$disconnect());
