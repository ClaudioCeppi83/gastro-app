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
import { Icons } from '@/components/icons';
import { ScrollArea } from "@/components/ui/scroll-area"
import { suggestProducts, SuggestProductsOutput } from '@/ai/flows/product-suggestions';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

const calculateSubtotal = (orderItems: OrderItem[]) => {
  return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const calculateIVA = (subtotal: number) => {
  return subtotal * 0.21; // 21% I.V.A.
};

const calculateTotal = (subtotal: number, iva: number, tip: number) => {
  return subtotal + iva + tip;
};

export default function Home() {
  const [tableNumber, setTableNumber] = useState<number | undefined>(undefined);
  const [guestCount, setGuestCount] = useState<number | undefined>(undefined);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tip, setTip] = useState(0);
  const subtotal = calculateSubtotal(orderItems);
  const iva = calculateIVA(subtotal);
  const total = calculateTotal(subtotal, iva, tip);
  const [aiSuggestions, setAiSuggestions] = useState<SuggestProductsOutput>([]);

  const addOrderItem = () => {
    if (!product || quantity <= 0 || price <= 0) {
      toast({
        title: "Error!",
        description: "Please fill product, quantity and price to add an item",
        variant: "destructive",
      })
      return;
    }

    const newItem: OrderItem = {
      id: Date.now().toString(),
      product,
      quantity,
      price,
    };
    setOrderItems([...orderItems, newItem]);
    setProduct('');
    setQuantity(1);
    setPrice(0);
  };

  const fetchAISuggestions = async () => {
    if (orderItems.length === 0) {
      return;
    }
    try {
      const suggestions = await suggestProducts({
        orderItems: orderItems.map(item => ({ productName: item.product, quantity: item.quantity }))
      });
      setAiSuggestions(suggestions);
    } catch (error: any) {
      console.error("Failed to fetch AI suggestions:", error);
      toast({
        title: "Error!",
        description: "Failed to fetch AI suggestions.",
        variant: "destructive",
      })
    }
  };

  useEffect(() => {
    fetchAISuggestions();
  }, [orderItems]);

    const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Remove leading zeros
        value = value.replace(/^0+/, '');
        // Ensure no negative numbers
        if (value === '' || parseInt(value) < 0) {
            setTableNumber(undefined);
        } else {
            setTableNumber(parseInt(value));
        }
    };

    const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Remove leading zeros
        value = value.replace(/^0+/, '');
        // Ensure no negative numbers
        if (value === '' || parseInt(value) < 0) {
            setGuestCount(undefined);
        } else {
            setGuestCount(parseInt(value));
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Remove leading zeros
        value = value.replace(/^0+/, '');
        // Ensure no negative numbers
        if (value === '' || parseInt(value) < 0) {
            setPrice(0);
        } else {
            setPrice(parseInt(value));
        }
    };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4 min-h-screen bg-background">
      <Toaster />

      {/* Table Configuration Card */}
      <Card className="w-full md:w-1/4">
        <CardHeader>
          <CardTitle>Table Configuration</CardTitle>
          <CardDescription>Set up table details for the order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input
              id="tableNumber"
              type="number"
              value={tableNumber !== undefined ? tableNumber : ''}
              onChange={handleTableNumberChange}
              min="0"
              className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="guestCount">Number of Guests</Label>
            <Input
              id="guestCount"
              type="number"
              value={guestCount !== undefined ? guestCount : ''}
              onChange={handleGuestCountChange}
              min="0"
              className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Input Card */}
      <Card className="w-full md:w-1/4">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Add products to the current order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="product">Product</Label>
            <Input
              id="product"
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={handlePriceChange}
              min="0"
              className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <Button onClick={addOrderItem} className="w-full">Add to Order</Button>
        </CardContent>
      </Card>

      {/* Order Display Card */}
      <Card className="w-full md:w-2/4 flex flex-col">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
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
        <CardFooter className="flex flex-col space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>I.V.A. (21%):</span>
            <span>{iva.toFixed(2)}</span>
          </div>
          <div>
            <Label htmlFor="tip">Tip</Label>
            <Input
              id="tip"
              type="number"
              value={tip}
              onChange={(e) => setTip(Number(e.target.value))}
              min="0"
            />
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>

      {/* AI Product Suggestions Card */}
      {aiSuggestions.length > 0 && (
        <Card className="w-full md:w-1/4">
          <CardHeader>
            <CardTitle>AI Product Suggestions</CardTitle>
            <CardDescription>Suggestions based on your current order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{suggestion.productName}</span>
                <Badge variant="secondary">{suggestion.reason}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

