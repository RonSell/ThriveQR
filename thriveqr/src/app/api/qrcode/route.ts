import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL is not set in the environment variables');
// }

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, //'postgresql://postgres:GYnFniWwPBbEZnNtrBMGPUfckbsJhdaB@autorack.proxy.rlwy.net:39609/railway', //process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('i');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM t_qrcodes WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}