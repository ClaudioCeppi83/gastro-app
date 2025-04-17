// src/app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Adapt this SQL query to your database library if needed
    // The goal is to insert a new order and retrieve its generated ID.
    // The exact syntax for getting the last inserted ID might vary.
    const insertQuery = 'INSERT INTO Orders (status, consumption_date, total_price) VALUES (?, NOW(), ?)';
    const insertValues = ['open', 0]; // Assuming 'open' is the initial status and 0 is the initial price
    await db.execute(insertQuery, insertValues);

    // Use a separate query to get the last inserted ID, as mysql2/promise might not return it directly
    const result = await db.execute("SELECT LAST_INSERT_ID() as orderId");
    // Access the orderId from the result of the SELECT query
    const orderId = (result as any)[0].orderId;
    return NextResponse.json({ orderId });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return NextResponse.json({ error: 'Failed to create order', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}