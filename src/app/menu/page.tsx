'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface MenuItem {
  id: string;
  name: string;
  ingredients: string;
  price: number;
}

const MenuPage: React.FC = () => {
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Burger',
      ingredients: 'Bread, Beef, Lettuce, Tomato, Cheese',
      price: 10.99,
    },
    {
      id: '2',
      name: 'Pizza',
      ingredients: 'Dough, Tomato Sauce, Cheese, Pepperoni',
      price: 12.99,
    },
    {
      id: '3',
      name: 'Salad',
      ingredients: 'Lettuce, Tomato, Cucumber, Carrot',
      price: 8.99,
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Ingredients</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.ingredients}</TableCell>
              <TableCell>{item.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuPage;
