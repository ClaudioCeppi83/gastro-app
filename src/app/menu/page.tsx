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

interface Dish {
  name: string;
  ingredients: string;
  price: number;
}

const STORAGE_KEY = "menu_dishes";

export default function Menu() {
  const initialDishes = () => {
    const storedDishes = localStorage.getItem(STORAGE_KEY);
    if (!storedDishes) {
      return [
        { name: "Pizza Margherita", ingredients: "Tomato, Mozzarella, Basil", price: 10.99 },
        { name: "Pizza Pepperoni", ingredients: "Tomato, Mozzarella, Pepperoni", price: 12.99 },
        { name: "Pizza Hawaiian", ingredients: "Tomato, Mozzarella, Ham, Pineapple", price: 11.99 },
        { name: "Pizza Vegetarian", ingredients: "Tomato, Mozzarella, Mushrooms, Peppers, Onions", price: 11.99 },
        { name: "Pizza BBQ Chicken", ingredients: "BBQ Sauce, Mozzarella, Chicken, Red Onion", price: 13.99 },
        { name: "Pasta Spaghetti", ingredients: "Spaghetti, Tomato Sauce, Basil", price: 9.99 },
        { name: "Pasta Fettuccine", ingredients: "Fettuccine, Alfredo Sauce, Parmesan Cheese", price: 11.99 },
        { name: "Pasta Penne", ingredients: "Penne, Pesto, Cherry Tomatoes", price: 10.99 },
      ];
    }
    return JSON.parse(storedDishes);
  };

  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [newDish, setNewDish] = useState<Dish>({ name: "", ingredients: "", price: 0 });
  const [newDishPrice, setNewDishPrice] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setNewDish({ ...newDish, price: 0 });
    } else {
      setNewDishPrice(value);
      setNewDish({ ...newDish, price: parseFloat(value) });
    }
  };

  const addDish = () => {
    if (newDish.name && newDish.ingredients && newDish.price > 0) {
      setDishes([...dishes, newDish]);
      setNewDish({ name: "", ingredients: "", price: 0 });
      setNewDishPrice("");
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  }, [dishes]);

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
                <TableHead>Ingredients</TableHead>
                <TableHead>Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.map((dish, index) => (
                <TableRow key={index} className="[&_td]:py-2">
                  <TableCell>{dish.name}</TableCell>
                  <TableCell>{dish.ingredients}</TableCell>
                  <TableCell>${dish.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="mt-10" aria-labelledby="form-section">
          <h2 id="form-section" className="text-xl font-semibold mb-4">Add New Dish</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5" onSubmit={(e) => e.preventDefault()}>
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
              <legend className="sr-only">Ingredients</legend>
              <Label htmlFor="ingredients">Ingredients</Label>
              <Input
                id="ingredients"
                name="ingredients"
                value={newDish.ingredients}
                onChange={handleInputChange}
              />
            </fieldset>

            <fieldset className="space-y-1">
              <legend className="sr-only">Unit Price</legend>
              <Label htmlFor="price">Unit Price</Label>
              <Input
                id="price"
                name="price"
                type="text"
                value={newDishPrice}
                onChange={handleNewDishPriceChange}
                min={0}
                className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </fieldset>
          </form>

          <footer className="mt-4">
            <Button type="button" onClick={addDish}>
              Add Dish
            </Button>
          </footer>
        </section>
      </main>
    </>
  );
}
