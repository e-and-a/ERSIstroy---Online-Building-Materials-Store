"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartItem, CartSnapshot } from "@/lib/cart/types";

const STORAGE_KEY = "ersi_cart";

function safeParse(json: string | null) {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("[useCart] Failed to parse cart state", error);
    return null;
  }
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (value && typeof value === "object" && "toNumber" in value && typeof value.toNumber === "function") {
    return value.toNumber();
  }
  return 0;
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  const stored = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  return [];
}

function computeSnapshot(items: CartItem[]): CartSnapshot {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + toNumber(item.price) * item.quantity, 0);
  return { items, totalItems, totalAmount };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    const normalizedItem = { ...item, price: toNumber(item.price) };
    setItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === normalizedItem.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === normalizedItem.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...prev, { ...normalizedItem, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const snapshot = useMemo(() => computeSnapshot(items), [items]);

  return {
    items: snapshot.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: snapshot.totalItems,
    totalAmount: snapshot.totalAmount
  };
}

