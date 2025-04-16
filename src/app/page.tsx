'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

const calculateSubtotal = (orderItems: OrderItem[]) =>
  orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

const calculateIVA = (subtotal: number) => subtotal * 0.21;
const calculateTotal = (subtotal: number, iva: number, tip: number) => subtotal + iva + tip;

interface Dish {
  name: string;
  ingredients: string;
  price: number;
}

export default function Home() {
  const [tableNumber, setTableNumber] = useState<number | undefined>();
  const [guestCount, setGuestCount] = useState<number | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [product, setProduct] = useState<Dish | null>(null);
  const [tip, setTip] = useState(0);
  const [tipPercentage, setTipPercentage] = useState("0");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const { toast } = useToast();

  const subtotal = calculateSubtotal(orderItems);
  const iva = calculateIVA(subtotal);
  const total = calculateTotal(subtotal, iva, tip);

  useEffect(() => {
    const storedDishes = localStorage.getItem('menu_dishes');
    setDishes(storedDishes ? JSON.parse(storedDishes) : []);
  }, []);

  const addOrderItem = () => {
    if (!product || quantity <= 0) {
      toast({
        title: "Error!",
        description: "Please select a product and quantity to add an item",
        variant: "destructive",
      });
      return;
    }

    const newItem: OrderItem = {
      id: Date.now().toString(),
      product: product.name,
      quantity,
      price: product.price,
    };
    setOrderItems([...orderItems, newItem]);
    setProduct(null);
    setQuantity(1);
    setPrice('');
  };

  const handleInputChange = (
    value: string,
    setter: (val: number | undefined) => void
  ) => {
    value = value.replace(/^0+/, '');
    const parsed = parseInt(value);
    setter(value === '' || parsed < 0 ? undefined : parsed);
  };

  return (
    <main className="flex flex-col md:flex-row p-4 gap-4 min-h-screen bg-background" suppressHydrationWarning={true}>
      <Toaster />

      <section className="w-full md:w-1/4" aria-labelledby="table-config-title">
        <Card>
          <CardHeader>
            <CardTitle id="table-config-title">Table Configuration</CardTitle>
            <CardDescription>Set up table details for the order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <section>
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                type="number"
                value={tableNumber ?? ''}
                onChange={(e) => handleInputChange(e.target.value, setTableNumber)}
                min="0"
                className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </section>
            <section>
              <Label htmlFor="guestCount">Number of Guests</Label>
              <Input
                id="guestCount"
                type="number"
                value={guestCount ?? ''}
                onChange={(e) => handleInputChange(e.target.value, setGuestCount)}
                min="0"
                className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </section>
          </CardContent>
        </Card>
      </section>

      <section className="w-full md:w-1/4" aria-labelledby="add-product-title">
        <Card>
          <CardHeader>
            <CardTitle id="add-product-title">Add Product</CardTitle>
            <CardDescription>Add products to the current order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <section>
              <Label htmlFor="product">Product</Label>
              <select
                id="product"
                value={product?.name ?? ""}
                onChange={(e) =>
                  setProduct(dishes.find((dish) => dish.name === e.target.value) || null)
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a product</option>
                {dishes.map((dish) => (
                  <option key={dish.name} value={dish.name}>
                    {dish.name}
                  </option>
                ))}
              </select>
            </section>
            <section>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
              />
            </section>
            <Button onClick={addOrderItem} className="w-full">
              Add to Order
            </Button>
          </CardContent>
        </Card>
      </section>

      <article className="w-full md:w-2/4" aria-labelledby="order-details-title">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle id="order-details-title">Order Details</CardTitle>
            <CardDescription>Details of the current order.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ScrollArea className="rounded-md border h-[400px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="flex justify-between w-full">
              <strong>Subtotal:</strong>
              <strong>{subtotal.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between w-full">
              <strong>I.V.A. (21%):</strong>
              <strong>{iva.toFixed(2)}</strong>
            </div>
            <div className="w-full">
              <Label htmlFor="tip">Tip</Label>
              <select
                id="tip"
                value={tipPercentage}
                onChange={(e) => {
                  setTipPercentage(e.target.value);
                  setTip(subtotal * Number(e.target.value) / 100);
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {[0, 5, 10, 15, 20, 25, 30].map((val) => (
                  <option key={val} value={val}>{val}%</option>
                ))}
              </select>
            </div>
            <Separator />
            <div className="flex justify-between w-full font-semibold">
              <strong>Total:</strong>
              <strong>{total.toFixed(2)}</strong>
            </div>
          </CardFooter>
        </Card>
      </article>
    </main>
  );
}
