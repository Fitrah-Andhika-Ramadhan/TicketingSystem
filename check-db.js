const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tickets = await prisma.ticket.findMany({
    select: {
      id: true,
      ticketNumber: true,
      status: true,
      solution: true,
      recommendation: true,
    }
  });
  console.log(JSON.stringify(tickets, null, 2));
}

main().finally(() => prisma.$disconnect());
