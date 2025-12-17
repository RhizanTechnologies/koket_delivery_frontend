"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  total: number;
  selectedIds: string[];
}

export function OrderSummary({
  subtotal,
  total,
  selectedIds,
}: OrderSummaryProps) {
  // Build checkout URL with selected item IDs
  const checkoutUrl =
    selectedIds.length > 0
      ? `/checkout?items=${selectedIds.join(",")}`
      : "/checkout";

  return (
    <div className="border-3 border-border rounded-lg p-6 bg-white">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Order Summary
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>ETB {subtotal.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
          <span className="text-foreground">Total</span>
          <span className="text-primary">ETB {total.toFixed(2)}</span>
        </div>
      </div>

      <Link href={checkoutUrl} passHref>
        <Button
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={subtotal === 0}
        >
          Proceed to checkout
        </Button>
      </Link>
      <p className="text-center text-sm text-muted-foreground mt-4">
        All cakes are freshly baked to order.
      </p>
    </div>
  );
}
