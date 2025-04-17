import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const query = `SELECT m.dish_id, m.name, m.unit_price, mc.category_id, mc.name AS category_name FROM Menu m JOIN MenuCategories mc ON m.category_id = mc.category_id ORDER BY mc.category_id, m.name`;
        const [rows] = await db.execute(query);
        return NextResponse.json(rows);
    } catch (error) {
        console.error(
            'Database error:',
            error instanceof Error ? error.message : error
        );
        return NextResponse.json(
          {
                error: 'Failed to fetch menu',
                details:
                    error instanceof Error ? error.message : 'An unknown error occurred',
                query:
                    "SELECT m.dish_id, m.name, m.unit_price, mc.category_id, mc.name AS category_name FROM Menu m JOIN MenuCategories mc ON m.category_id = mc.category_id",
            },
            { status: 500 }
        );
    }
}