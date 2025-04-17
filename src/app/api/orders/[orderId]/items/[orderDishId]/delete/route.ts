import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string; orderDishId: string } }
) {
  try {
    const orderId = parseInt(params.orderId, 10);
    const orderDishId = parseInt(params.orderDishId, 10);

    if (isNaN(orderId) || isNaN(orderDishId)) {
      return NextResponse.json(
        { error: 'Invalid order ID or order item ID' },
        { status: 400 }
      );
    }

    // Adapt this SQL query to your database library if needed
    const query = 'DELETE FROM OrderDishes WHERE order_dish_id = ? AND order_id = ?';
    await db.execute(query, [orderDishId, orderId]);

    return NextResponse.json(
      { message: 'Order item deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting order item:', error);
    return NextResponse.json(
      { error: 'Failed to delete order item' },
      { status: 500 }
    );
  }
}