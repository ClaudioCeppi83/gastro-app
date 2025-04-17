'use client';

import { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"


interface Dish {
  id: number;
  name: string;
  price: number;
  category_id: number;
  category?: string;
}

interface OrderItem {
  dish: Dish;
  quantity: number;
  order_dish_id: number;
  price: number; 
}


export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);

    
    const loadData = async () => {
      try {
        // 1. Cargar menú
        fetch('/api/menu')
        .then(menuRes => {
          if (!menuRes.ok) {
            const errorMessage = `Failed to load menu: ${menuRes.status} ${menuRes.statusText}`;
            throw new Error(errorMessage);
          }
          return menuRes.json();
        })
        .then(menuData => {
          // Transformar datos para coincidir con tu interfaz Dish
          const dishes = menuData.map((item: { dish_id: number; name: string; unit_price: number; category_id: number; category_name: string; }) => ({
            id: item.dish_id,
            name: item.name,
            price: item.unit_price,
            category_id: item.category_id,
            category: item.category_name
          }));
          setDishes(dishes);
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            console.error(error.message);
          }
          alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        });

        // 2. Crear nueva orden
        const orderRes = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        if (!orderRes.ok) throw new Error('Failed to create order');
        const { orderId } = await orderRes.json();
        setOrderId(orderId);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
      }
    }


 useEffect(() => {
    loadData();
    console.log("Dishes:", dishes);
    console.log("Order Items:", orderItems);
    console.log("Order ID:", orderId);
  }, []);

  const addToOrder = (dish: Dish) => {
    const existingItem = orderItems.find(item => item.dish.id === dish.id);
    if (existingItem) {
      setOrderItems(prev =>
        prev.map(item =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else if (orderId) {
      fetch(`/api/orders/${orderId}/items/add`, {
        method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            dish_id: dish.id,
            quantity: 1,
            ordered_name: dish.name,
            ordered_unit_price: dish.price,
            ordered_category_id: dish.category_id,
          }
        ]),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al añadir el plato');
          }
          return response.json();
        })
        .then(() => {
          // Fetch updated order items
          fetchOrderItems();
        })
        .catch((error: unknown) => {
          console.error(error);
        });
    }

  };

  const removeFromOrder = (orderDishId: number) => {
    if (orderId) {
      fetch(`/api/orders/${orderId}/items/${orderDishId}/delete`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el plato');
          }
          return response.json();
        })
        .then(() => {
          // Fetch updated order items
          fetchOrderItems();
        })
        .catch((error: unknown) => {
          if (error instanceof Error) { console.error(error.message); }
        });
    }
    // setOrderItems(prev =>
    //   prev
    //     .map(item =>
    //       item.dish.id === dishId
    //         ? { ...item, quantity: item.quantity - 1 }
    //         : item
    //     )
    //     .filter(item => item.quantity > 0)
    // );    
    
  };

  const fetchOrderItems = () => {
    if (orderId) {
      Promise.all([
        fetch(`/api/orders/${orderId}/items`).then(res => res.json()),
        fetch('/api/dishes').then(res => res.json())
      ])
        .then(([orderItemsData, dishesData]) => {
          if (Array.isArray(orderItemsData) && Array.isArray(dishesData)) {
            const dishMap = dishesData.reduce((map: any, dish: Dish) => {
              map[dish.id] = dish;
              return map;
            }, {});

            const items = orderItemsData.map((item: any) => ({
              dish: dishMap[item.dish_id] || { id: item.dish_id, name: item.ordered_name, price: 0, category_id: 0 },
              quantity: item.quantity,
              order_dish_id: item.order_dish_id,
            }));
            setOrderItems(items.map(item => ({ 
              ...item,
              price: item.dish?.price * item.quantity,
            })));
          }
        }) 
        .catch((error: unknown) => {
          if (error instanceof Error) { console.error("Error fetching order items:", error.message); }
          console.error("Error fetching order items:", error);
        });
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
    const iva = subtotal * 0.12;
    const tip = subtotal * 0.10;
    const total = subtotal + iva + tip;
    return { subtotal, iva, tip, total };
  };

  const totals = calculateTotals();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(1);


  const handleAddProduct = () => {
    if (selectedDish) {
      for (let i = 0; i < quantity; i++) {
        addToOrder(selectedDish);
      }
      setSelectedDish(null);
      setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="container mx-auto py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Mesa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="tableNumber">Nº de mesa</Label>
                <Input id="tableNumber" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-24" />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="guestCount">Cantidad de Personas</Label>
                <Input id="guestCount" type="number" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-24" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agregar Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={(value) => setSelectedDish(dishes.find(dish => dish.name === value) || null)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar Producto">
                    {selectedDish ? selectedDish.name : "Seleccionar Producto"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {dishes.map(dish => (
                    <SelectItem key={dish.id} value={dish.name}>
                      {dish.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24"
                />
                <Button onClick={handleAddProduct} disabled={!selectedDish}>Agregar</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Orden Actual</CardTitle>
          </CardHeader>
          <CardContent>
            {orderItems.length === 0 ? (
              <p className="text-gray-500">No hay productos en el pedido.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map(item => (
                    <TableRow key={item.order_dish_id}>
                      <TableCell>{item.dish.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price.toFixed(2)} €</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => removeFromOrder(item.order_dish_id)}>Eliminar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="font-semibold">Sub Total:</div>
              <div>{totals.subtotal.toFixed(2)} €</div>
              <div className="font-semibold">I.V.A. (12%):</div>
              <div>{totals.iva.toFixed(2)} €</div>
              <div className="font-semibold">Propina (10%):</div>
              <div>{totals.tip.toFixed(2)} €</div>
              <div className="font-semibold">Total:</div>
              <div>{totals.total.toFixed(2)} €</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
  }
}

