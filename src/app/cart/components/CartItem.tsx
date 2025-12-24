"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface CartItemProps {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  selected?: boolean;
  onSelect?: () => void;
  onQuantityChange: (quantity: number) => void;
  onDelete: () => void;
}

export function CartItem({
  image,
  name,
  category,
  price,
  quantity,
  onQuantityChange,
  onDelete,
}: CartItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg transition-all">
        <div className="flex gap-4 flex-1">
          <img
            src={image || "/assets/placeholder-product.jpg"}
            alt={name}
            className="w-24 h-24 object-cover rounded-lg border border-border"
          />
          <div className="flex-1">
            <h3 className="text-sm lg:text-base font-semibold text-foreground">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">{category}</p>
            <p className="text-pink-500 font-semibold mt-2">${price}</p>
          </div>
        </div>

        <div className="flex md:flex-col lg:flex-row items-end justify-center sm:justify-between lg:justify-end gap-4 mt-2 md:mt-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(Math.max(1, quantity - 1));
              }}
            >
              −
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                e.stopPropagation();
                onQuantityChange(
                  Math.max(1, Number.parseInt(e.target.value) || 1)
                );
              }}
              className="w-12 text-center border border-border rounded px-2 py-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(quantity + 1);
              }}
            >
              +
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={onDelete}
      />
    </>
  );
}
