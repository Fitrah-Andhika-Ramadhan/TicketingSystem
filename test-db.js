const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const fetched = await prisma.ticket.findUnique({
    where: { ticketNumber: 'TICKET-002' }
  });
  console.log("Fetched:", fetched.solution, fetched.recommendation, fetched.status);
}

main().finally(() => prisma.$disconnect());
