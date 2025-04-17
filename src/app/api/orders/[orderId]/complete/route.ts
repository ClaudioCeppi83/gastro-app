// src/app/api/orders/[orderId]/complete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming you have a db connection object

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = parseInt(params.orderId, 10);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Adapt this SQL query to your database library if needed
    const query = 'UPDATE Orders SET status = \'completed\' WHERE order_id = ?';
    await db.execute(query, [orderId]);

    return NextResponse.json(
      { message: 'Order completed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error completing order:', error);
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    );
  }
}