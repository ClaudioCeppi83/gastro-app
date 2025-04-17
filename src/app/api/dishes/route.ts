ts
// src/app/api/dishes/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const dishes = [
    { "id": 1, "name": "Paella", "price": 12.5, "category_id": 2 },
    { "id": 2, "name": "Tortilla", "price": 6, "category_id": 1 },
    { "id": 3, "name": "Ensalada mixta", "price": 8.0, "category_id": 1 },
    { "id": 4, "name": "Gazpacho", "price": 5.5, "category_id": 1 },
    { "id": 5, "name": "Fabada asturiana", "price": 15.0, "category_id": 2 },
    { "id": 6, "name": "Pulpo a la gallega", "price": 18.0, "category_id": 2 },
    { "id": 7, "name": "Tarta de Santiago", "price": 7.0, "category_id": 3 },
    { "id": 8, "name": "Crema catalana", "price": 6.5, "category_id": 3 },
  ];

  return NextResponse.json(dishes);
}