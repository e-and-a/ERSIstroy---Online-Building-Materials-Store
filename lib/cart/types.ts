import type { Unit } from "@prisma/client";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  unit: Unit;
  image?: string;
  quantity: number;
};

export type CartSnapshot = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
};

