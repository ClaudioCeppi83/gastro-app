"use client";

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
  dish_name: string;
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
  const [newDish, setNewDish] = useState<{ name: string; unit_price: number; category_id: string }>({ name: "", unit_price: 0, category_id: "" });
  const [newDishPrice, setNewDishPrice] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data: MenuItem[] = await response.json();
          setMenuItems(data);
        } else {
          console.error("Failed to fetch menu:", response.status);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories'); // Assuming you'll create this API route
        if (response.ok) {
          const data: Category[] = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", response.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

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
    let value = e.target.value;
    value = value.replace(/^0+/, "");
    if (value === "" || parseInt(value) < 0) {
      setNewDishPrice("");
      setNewDish({ ...newDish, unit_price: 0 });
    } else {
      setNewDishPrice(value);
      setNewDish({ ...newDish, unit_price: parseFloat(value) });
    }
  };

  const addDish = async () => {
    if (newDish.name && newDish.unit_price > 0 && newDish.category_id) {
      try {
        const response = await fetch('/api/menu/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newDish.name, unit_price: newDish.unit_price, category_id: Number(newDish.category_id) }),
        });

        if (response.ok) {
          setNewDish({ name: "", unit_price: 0, category_id: "" });
          setNewDishPrice("");
          // Assuming the API returns the new dish's data, including dish_id
          const newDishData = await response.json(); // Or response.text() if it's just a success message
          fetchMenuItems(); // Refresh the menu list
        } else {
          console.error("Failed to add dish:", response.status);
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
                <TableRow key={item.dish_id} className="[&_td]:py-2">
                  <TableCell>{item.dish_name}</TableCell>
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
              <legend className="sr-only">Dish Name</legend>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newDish.name}
                onChange={handleInputChange}
              />
            </fieldset>

            <fieldset className="space-y-1">
              <legend className="sr-only">Category</legend>
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
              <legend className="sr-only">Unit Price</legend>
              <Label htmlFor="unit_price">Unit Price</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="text"
                value={newDishPrice}
                onChange={handleNewDishPriceChange}
                min={0}
                className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </fieldset>
          </form>

          <footer className="mt-4">
            <Button type="submit">
              Add Dish
            </Button>
          </footer>
        </section>
      </main>
    </>
  );
}
