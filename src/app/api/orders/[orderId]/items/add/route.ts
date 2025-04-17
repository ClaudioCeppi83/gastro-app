import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming your db connection is in '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const orderItems = await req.json();

    if (!Array.isArray(orderItems)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected an array of order items.' },
        { status: 400 }
      );
    }

    const [item] = orderItems; // Get the first item from the array
    const { dish_id, quantity, ordered_name, ordered_unit_price } = item;

    // Basic validation (you might want to add more)
    if (!dish_id || !ordered_name || !ordered_unit_price) {
      return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
    }

    // SQL query to insert the order item with its category
    const query = `
      INSERT INTO OrderDishes (order_id, dish_id, quantity, ordered_name, ordered_unit_price, ordered_category_id)
      VALUES (?, ?, ?, ?, ?, (SELECT category_id FROM Dishes WHERE id = ?))
    `;
    
    // Execute the query
    await db.execute(query, [orderId, dish_id, 1, ordered_name, ordered_unit_price, dish_id]); 

    return NextResponse.json(
      { message: 'Item added to order successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding item to order:', error);
    return NextResponse.json(
      { error: 'Failed to add item to order' },
      { status: 500 }
    );
  }
}