'use client';

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";

interface MenuItem {
  dish_id: number;
  name: string;
  category_name: string;
  unit_price: number;
}

interface Category {
  category_id: number;
  name: string;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newDish, setNewDish] = useState({
    name: "",
    unit_price: 0,
    category_id: ""
  });
  const [newDishPrice, setNewDishPrice] = useState("");

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data: MenuItem[] = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data: Category[] = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDish({
      ...newDish,
      [name]: value,
    });
  };

  const handleNewDishPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+/, "") || "0";
    setNewDishPrice(value);
    setNewDish({ 
      ...newDish, 
      unit_price: parseFloat(value) || 0 
    });
  };

  const addDish = async () => {
    if (newDish.name && newDish.unit_price > 0 && newDish.category_id) {
      try {
        const response = await fetch('/api/menu/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name: newDish.name, 
            unit_price: newDish.unit_price, 
            category_id: Number(newDish.category_id) 
          }),
        });

        if (response.ok) {
          setNewDish({ name: "", unit_price: 0, category_id: "" });
          setNewDishPrice("");
          await fetchMenuItems(); // Usamos la función definida
        }
      } catch (error) {
        console.error("Error adding dish:", error);
      }
    }
  };

  return (
    <>
      <PageTitle title="Menu" />
      <main className="container mx-auto py-10">
        <section aria-labelledby="menu-section">
          <h2 id="menu-section" className="sr-only">Dish Menu</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.dish_id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="mt-10" aria-labelledby="form-section">
          <h2 id="form-section" className="text-xl font-semibold mb-4">Add New Dish</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5" onSubmit={(e) => { e.preventDefault(); addDish(); }}>
            <fieldset className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newDish.name}
                onChange={handleInputChange}
              />
            </fieldset>

            <fieldset className="space-y-1">
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                name="category_id"
                value={newDish.category_id}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="space-y-1">
              <Label htmlFor="unit_price">Unit Price</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                value={newDishPrice}
                onChange={handleNewDishPriceChange}
                min="0"
                step="0.01"
              />
            </fieldset>

            <Button type="submit" className="md:col-span-3">
              Add Dish
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}