import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Promise((resolve) => {
    // Run prisma db push using the production environment variables
    exec('npx prisma db push --accept-data-loss', { env: process.env }, (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ success: false, error: error.message, stderr }));
      } else {
        resolve(NextResponse.json({ success: true, stdout, message: "Database schema successfully pushed!" }));
      }
    });
  });
}
