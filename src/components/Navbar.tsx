'use client';

import React from 'react';
import Link from 'next/link';
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
    <nav className="bg-background border-b flex h-16 items-center px-4">
      <Link href="/" className="font-semibold text-xl">
        OrderFlow {/* Assuming OrderFlow is the logo/home link */}
      </Link>
      <ul className="ml-auto flex items-center space-x-4">
        <li>
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
        </li>
        <li><Link href="/orders" className="text-sm font-medium transition-colors hover:text-primary">Orders</Link></li>
        <li>
          <Link href="/reports" className="text-sm font-medium transition-colors hover:text-primary">
            Reports
          </Link>
        </li>
        <li><Link href="/menu" className="text-sm font-medium transition-colors hover:text-primary">Menu</Link></li>
      </ul>
    </nav>
  );
}
