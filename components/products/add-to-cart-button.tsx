"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/use-cart";
import type { Unit } from "@prisma/client";

type AddToCartButtonProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    unit: Unit;
    image?: string;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleAdd() {
    setIsAdding(true);
    try {
      addItem({ ...product }, 1);
      setFeedback("Товар добавлен в корзину");
      setTimeout(() => setFeedback(null), 2500);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="add-to-cart flex flex-col gap-2">
      <Button className="w-full" onClick={handleAdd} disabled={isAdding}>
        {isAdding ? "Добавляем..." : "Добавить в корзину"}
      </Button>
      {feedback && (
        <p className="add-to-cart__feedback text-center text-sm text-green-600">{feedback}</p>
      )}
    </div>
  );
}

