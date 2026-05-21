const { generateToken } = require('./lib/auth');

async function testFrontend() {
  const token = generateToken({ userId: '1', email: 'admin@fitrahpro.com', role: 'SUPER_ADMIN' });
  
  // Update
  console.log("Sending PATCH request...");
  const patchRes = await fetch('http://localhost:3000/api/tickets/2', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      solution: "New test QA1",
      recommendation: "New test QA1 rec",
      status: "IN_REVIEW",
      progress: 100
    })
  });
  
  const patchData = await patchRes.json();
  console.log("PATCH response success:", patchData.success);
  console.log("PATCH solution:", patchData.data?.solution);
  console.log("PATCH recommendation:", patchData.data?.recommendation);

  // Get
  console.log("Sending GET request...");
  const getRes = await fetch('http://localhost:3000/api/tickets/2', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const getData = await getRes.json();
  console.log("GET response success:", getData.success);
  console.log("GET solution:", getData.data?.solution);
  console.log("GET recommendation:", getData.data?.recommendation);
}

testFrontend().catch(console.error);
