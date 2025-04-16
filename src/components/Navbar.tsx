'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
  return (
    <div className="bg-background border-b flex h-16 items-center px-4">
      <div className="font-semibold text-xl">
        OrderFlow
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <Button variant="link" href="/">Home</Button>
        <Button variant="link" href="/orders">Orders</Button>
        <Button variant="link" href="/reports">Reports</Button>
        <Button variant="link" href="/menu">Menu</Button>
      </div>
    </div>
  );
}

