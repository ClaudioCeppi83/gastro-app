import { NextResponse } from 'next/server';

// Assume 'db' is your database connection object
// You'll need to replace this with your actual database connection
const db = {
  query: async (sql: string) => {
    // Replace this with your actual database query logic
    console.log("Executing SQL:", sql);
    return Promise.resolve([{ category_id: 1, name: 'Appetizer' }, { category_id: 2, name: 'Pizza' }, { category_id: 3, name: 'Pasta' }, { category_id: 4, name: 'Dessert' }, { category_id: 5, name: 'Drink' }]);
  }
};

export async function GET() {
  try {
    const results: { category_id: number, name: string }[] = await db.query('SELECT category_id, name FROM MenuCategories');
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}