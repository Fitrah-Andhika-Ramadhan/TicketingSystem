const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ticket = await prisma.ticket.update({
    where: { ticketNumber: 'TICKET-001' },
    data: {
      solution: 'test-solution-123',
      recommendation: 'test-recommendation'
    }
  });
  console.log("Updated:", ticket.solution, ticket.recommendation);

  const fetched = await prisma.ticket.findUnique({
    where: { ticketNumber: 'TICKET-001' }
  });
  console.log("Fetched:", fetched.solution, fetched.recommendation);
}

main().finally(() => prisma.$disconnect());
