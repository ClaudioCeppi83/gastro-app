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

    const { total_price } = await request.json();

    if (typeof total_price !== 'number') {
      return NextResponse.json(
        { error: 'Invalid total price' },
        { status: 400 }
      );
    }

    // Adapt this SQL query to your database library if needed
    const query = 'UPDATE Orders SET total_price = ? WHERE order_id = ?';
    await db.execute(query, [total_price, orderId]);

    return NextResponse.json(
      { message: 'Order total price updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating order total price:', error);
    return NextResponse.json(
      { error: 'Failed to update order total price' },
      { status: 500 }
    );
  }
}