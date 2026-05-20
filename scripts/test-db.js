const { Client } = require('pg');

async function scanPoolerIndexes() {
  const username = 'postgres.anqaboykkngnssgmfcem';
  const password = 'VibeDesk-2026';
  const region = 'ap-northeast-1'; // Tokyo
  
  for (let i = 0; i <= 5; i++) {
    const host = `aws-${i}-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://${username}:${password}@${host}:6543/postgres`;
    
    console.log(`Scanning index ${i}: ${host}...`);
    const client = new Client({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000
    });

    try {
      await client.connect();
      console.log(`\n🎉 CONNECTED SUCCESSFULLY on index ${i}!`);
      console.log(`Use this DATABASE_URL: postgresql://${username}:[PASSWORD]@${host}:6543/postgres?pgbouncer=true`);
      console.log(`Use this DIRECT_URL: postgresql://postgres:[PASSWORD]@db.anqaboykkngnssgmfcem.supabase.co:5432/postgres`);
      await client.end();
      return;
    } catch (err) {
      console.log(`  index ${i} error: ${err.message}`);
    }
  }
  console.log('\nScan finished. No server index matched.');
}

scanPoolerIndexes();
