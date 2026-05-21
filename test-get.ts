const { NextRequest } = require('next/server');
const { GET } = require('./app/api/tickets/[id]/route');
const { generateToken } = require('./lib/auth');

async function test() {
  const token = generateToken({ userId: '1', email: 'admin@fitrahpro.com', role: 'SUPER_ADMIN' });
  
  const req = new NextRequest('http://localhost:3000/api/tickets/2', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const res = await GET(req, { params: { id: '2' } });
  const data = await res.json();
  
  console.log("Response Solution:", data.data?.solution);
  console.log("Response Recommendation:", data.data?.recommendation);
}

test().catch(console.error);
