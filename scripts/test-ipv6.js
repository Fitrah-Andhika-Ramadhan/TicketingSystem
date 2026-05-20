const { Client } = require('pg');

async function testDirectIPv6() {
  const connectionString = 'postgresql://postgres:VibeDesk-2026@db.anqaboykkngnssgmfcem.supabase.co:5432/postgres';
  
  console.log('Testing direct IPv6 connection to:', connectionString.replace(/:[^:@]+@/, ':****@'));
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();
    console.log('🎉 SUCCESS! Connected directly to Supabase PostgreSQL using IPv6.');
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0].now);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testDirectIPv6();
