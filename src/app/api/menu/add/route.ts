import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming your db connection is here

export async function POST(request: Request) {
  try {
    const { name, category_id, unit_price } = await request.json();

    if (!name || !category_id || !unit_price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO Menu (name, category_id, unit_price) VALUES (?, ?, ?)',
      [name, category_id, unit_price]
    );

    // Assuming your database library returns an insertId property on the result
    const dishId = result.insertId; 

    return NextResponse.json({ message: "Dish added successfully", dishId }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding dish:", error);
    return NextResponse.json({ error: "Failed to add dish" }, { status: 500 });
  }
}