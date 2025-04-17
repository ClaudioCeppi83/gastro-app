import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming your db connection is here

export async function GET() {
  try {
    const query = `
      SELECT 
        m.dish_id, 
        m.name AS dish_name,
        m.unit_price,
        mc.name AS category_name
      FROM Menu m
      JOIN MenuCategories mc ON m.category_id = mc.category_id;
    `;

    const [rows] = await db.execute(query); // Adjust based on your db library

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}