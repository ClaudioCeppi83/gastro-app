import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming your database connection is in '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = parseInt(params.orderId);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const query = `
      SELECT od.dish_id, od.ordered_name, od.quantity, od.order_dish_id
      FROM OrderDishes od      
      WHERE od.order_id = ?
    `;
    const result = await db.execute(query, [orderId]);
    const rows = result.rows as any[]; // Adjust type assertion if needed for your DB library

    const orderItems = rows.map(row => ({
      dish_id: row.dish_id,
      ordered_name: row.ordered_name,
      quantity: row.quantity,
      order_dish_id: row.order_dish_id,
    }));

    return NextResponse.json(orderItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching order items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order items' },
      { status: 500 }
    );
  }
}