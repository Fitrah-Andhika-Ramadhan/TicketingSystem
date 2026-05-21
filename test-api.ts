const { NextRequest } = require('next/server');
const { PATCH } = require('./app/api/tickets/[id]/route');
const { generateToken } = require('./lib/auth');

async function test() {
  const token = generateToken({ userId: '1', email: 'admin@fitrahpro.com', role: 'SUPER_ADMIN' });
  
  const req = new NextRequest('http://localhost:3000/api/tickets/2', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      solution: 'Test Solution A',
      recommendation: 'Test Recommendation A',
      status: 'IN_REVIEW',
      progress: 100
    })
  });

  const res = await PATCH(req, { params: { id: '2' } });
  const data = await res.json();
  
  console.log("Response:", JSON.stringify(data, null, 2));
}

test().catch(console.error);
