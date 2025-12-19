"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CartItem } from "./components/CartItem";
import { OrderSummary } from "./components/OrderSummary";
import { PageHeader } from "@/components";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import LoadingState from "@/components/LoadingState";
import { updateCartItem, removeFromCart } from "@/app/services/cartService";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/app/utils/errorHandler";

interface CartItemData {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  kilo?: number;
  custom_text?: string;
  additional_description?: string;
}

const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5001";

const resolveImageUrl = (path?: string) => {
  if (!path) return "/assets/img1.png"; // Fallback image
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${ASSET_BASE_URL}${path}`;
};

export default function ShoppingCartPage() {
  const { cartItems, isLoading, refreshCart } = useCart();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Refresh cart when component mounts
  useEffect(() => {
    refreshCart();
  }, []);

  // Convert cart items from API to display format
  useEffect(() => {
    const mappedItems: CartItemData[] = cartItems.map((item) => {
      const product = item.product;
      const imageUrl = product?.images?.[0] || product?.image_url;

      // Get category name
      const categoryName =
        typeof product?.category_id === "object"
          ? product.category_id.name
          : "Category";

      // Calculate price based on subcategory
      let price = 0;
      const subcategory =
        typeof product?.subcategory_id === "object"
          ? product.subcategory_id
          : null;

      if (subcategory) {
        // If item is sold by kilo and has kilo_to_price_map
        if (item.kilo && subcategory.kilo_to_price_map) {
          const kiloKey = `${item.kilo}kg`;
          price = subcategory.kilo_to_price_map[kiloKey] || 0;
        }
        // If item is sold by pieces, use direct price
        else if (item.pieces && subcategory.price) {
          price = subcategory.price;
        }
        // Fallback to direct price if available
        else if (subcategory.price) {
          price = subcategory.price;
        }
      }

      return {
        id: item._id,
        image: resolveImageUrl(imageUrl),
        name: product?.name || "Product Name",
        category: categoryName,
        price: price,
        quantity: item.quantity,
        kilo: item.kilo,
        custom_text: item.custom_text,
        additional_description: item.additional_description,
      };
    });
    setItems(mappedItems);
  }, [cartItems]);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    try {
      // Optimistically update local state first for instant UI feedback
      setItems(
        items.map((item) => (item.id === id ? { ...item, quantity } : item))
      );

      // Update in API in the background
      await updateCartItem(id, { quantity });

      // Note: We don't call refreshCart() here to avoid re-rendering the whole page
      // The local state is already updated optimistically above
    } catch (error: any) {
      console.error("Failed to update quantity:", error);
      toast.error(getErrorMessage(error, "Failed to update quantity"));

      // Revert optimistic update on error by refreshing from API
      await refreshCart();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete from API
      await removeFromCart(id);

      // Update local state
      setItems(items.filter((item) => item.id !== id));
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));

      // Refresh cart context
      await refreshCart();

      toast.success(getSuccessMessage("remove", "Item"));
    } catch (error: any) {
      console.error("Failed to delete item:", error);
      toast.error(getErrorMessage(error, "Failed to remove item from cart"));
    }
  };

  const subtotal = items
    .filter((item) => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const total = subtotal;

  // Save selected items to localStorage when they change
  useEffect(() => {
    if (selectedIds.length > 0) {
      localStorage.setItem("selectedCartItems", JSON.stringify(selectedIds));
    } else {
      localStorage.removeItem("selectedCartItems");
    }
  }, [selectedIds]);

  if (isLoading) {
    return <LoadingState message="Loading your cart..." />;
  }

  return (
    <div className="min-h-screen bg-background-2">
      <div>
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <PageHeader
            title="Shopping Cart"
            subtitle="Select your items and proceed to checkout"
          />
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-24 pb-8 sm:pb-12">
          {/* Cart Items - Left Side on Large Screens */}
          <div
            className={`${
              items.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
            } space-y-3 sm:space-y-4 order-1 lg:order-1`}
          >
            {/* Selection Info Bar */}
            {items.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 text-sm px-4 py-3 rounded-xl shadow-sm">
                <p className="text-primary">
                  <span className="hidden sm:inline">
                    Tap on items to select.{" "}
                  </span>
                  <span className="font-semibold">
                    {selectedIds.length} item
                    {selectedIds.length !== 1 ? "s" : ""} selected
                  </span>
                </p>
                {selectedIds.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/40 text-primary hover:bg-primary/20 bg-transparent transition-all w-full sm:w-auto"
                    onClick={() => setSelectedIds([])}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            )}

            {items.length > 0 ? (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`transition-all duration-200 cursor-pointer rounded-xl border-2 ${
                      selectedIds.includes(item.id)
                        ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                        : "border-border bg-card hover:shadow-md hover:border-primary/30"
                    }`}
                  >
                    <CartItem
                      {...item}
                      selected={selectedIds.includes(item.id)}
                      onSelect={() => handleSelect(item.id)}
                      onQuantityChange={(quantity) =>
                        handleQuantityChange(item.id, quantity)
                      }
                      onDelete={() => handleDelete(item.id)}
                    />
                  </div>
                ))}
                <Link href="/products" className="block mt-6">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-primary/40 text-primary hover:bg-primary/10 bg-transparent transition-all hover:shadow-md"
                  >
                    + Continue Shopping
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[500px] py-12 sm:py-16 md:py-20 px-4">
                <div className="max-w-md w-full text-center">
                  {/* Icon */}
                  <div className="mb-6 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>

                  {/* Text */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Your Cart is Empty
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                    Looks like you haven't added any delicious cakes yet. Browse
                    our collection and find your perfect treat!
                  </p>

                  {/* CTA Button */}
                  <div className="flex justify-center">
                    <Link href="/products">
                      <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                        Browse Products
                      </Button>
                    </Link>
                  </div>

                  {/* Decorative Element */}
                  <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="w-8 h-px bg-border"></div>
                    <span className="text-xs">Start Shopping</span>
                    <div className="w-8 h-px bg-border"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Right Side on Large Screens */}
          {items.length > 0 && (
            <div className="lg:col-span-1 order-2 lg:order-2">
              <div className="sticky top-4 sm:top-6 lg:top-8">
                <OrderSummary
                  subtotal={subtotal}
                  total={total}
                  selectedIds={selectedIds}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
