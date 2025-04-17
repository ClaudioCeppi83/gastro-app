// src/app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming you have a db connection in this path

export async function POST(req: NextRequest) {
  try {
    // Adapt this SQL query to your database library if needed
    // The goal is to insert a new order and retrieve its generated ID.
    // The exact syntax for getting the last inserted ID might vary.
    const insertQuery = 'INSERT INTO Orders (status, consumption_date, total_price) VALUES (?, NOW(), ?)';
    const insertValues = ['open', 0]; // Assuming 'open' is the initial status and 0 is the initial price
    await db.execute(insertQuery, insertValues);

    // Assuming your database library returns the inserted ID in a result object
    const [[result]] = await db.execute("SELECT LAST_INSERT_ID() as orderId");
    const orderId = result.orderId;

    return NextResponse.json({ orderId });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}