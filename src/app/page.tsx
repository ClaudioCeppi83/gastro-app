'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Dish {
  id: number;
  name: string;
  price: number;
  category_id: number;
}

interface OrderItem {
  dish: Dish;
  quantity: number;
}

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/dishes')
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(error => {
        console.error(error);
      });

    const createNewOrder = async () => {
      try {
        const response = await fetch('/api/orders/create', { method: 'POST' });
        const data = await response.json();
        if (response.ok && data.orderId) {
          setOrderId(data.orderId);
        } else {
          throw new Error(data.error || 'Error al crear el pedido');
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    createNewOrder();
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
          },
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
        .catch(error => {
          console.error(error);
        });
    }
    
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems(prev =>
      prev
        .map(item =>
          item.dish.id === dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const fetchOrderItems = () => {
    if (orderId) {
      fetch(`/api/orders/${orderId}/items`)
        .then(response => response.json())
        .then(data => {
          // Assuming your API returns an array of { dish_id, quantity, ... }
          if (Array.isArray(data)) {
            const items = data.map((item: any) => ({
              dish: { id: item.dish_id, name: item.ordered_name },
              quantity: item.quantity,
              order_dish_id: item.order_dish_id,
            }));
            setOrderItems(items);
        }})
        .catch(error => console.error("Error fetching order items:", error));
    }
  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8 relative">
      {orderId && (
        <div className="absolute top-4 right-4 bg-gray-100 rounded-md px-3 py-1 text-sm">
          Pedido #{orderId}
        </div>
      )}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Menú del Restaurante</h1>
        <p className="text-muted-foreground">Haz tu pedido seleccionando los platos</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map(dish => (
          <article key={dish.id} className="p-4 rounded-xl shadow bg-white space-y-2">
            <h2 className="text-xl font-semibold">{dish.name}</h2>
            <p className="text-gray-700">{dish.price.toFixed(2)} €</p>
            <Button onClick={() => addToOrder(dish)}>Añadir</Button>
          </article>
        ))}
      </section>

      <aside className="bg-gray-100 p-4 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold">Pedido Actual</h2>
        {orderItems.length === 0 ? (
          <p className="text-gray-600">No hay productos en el pedido.</p>
        ) : (
          <ul className="space-y-2">
            {orderItems.map(item => (
              <li key={item.dish.id} className="flex justify-between items-center">
                <p className="text-lg">
                  {item.quantity}× {item.dish.name}
                </p>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => removeFromOrder(item.dish.id)}
                  >
                    -
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => addToOrder(item.dish)}
                  >
                    +
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <footer className="pt-4 border-t">
          <p className="text-xl font-bold">Total: {total.toFixed(2)} €</p>
        </footer>
      </aside>
    </main>
  );
}
