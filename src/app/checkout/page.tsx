"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContactPaymentForm } from "./components/ContactPaymentForm";
import { CheckoutItemPreview } from "./components/CheckoutItemPreview";
import { PageHeader } from "@/components";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCart } from "@/app/context/CartContext";
import LoadingState from "@/components/LoadingState";
import { createOrder, type OrderItem } from "@/app/services/orderService";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/app/utils/errorHandler";
import { orderSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";

interface CheckoutItem {
  id: string;
  image: string;
  name: string;
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

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, isLoading, refreshCart } = useCart();

  // Get selected item IDs from URL params or localStorage
  const selectedIds = useMemo(() => {
    const urlIds = searchParams.get("items");
    if (urlIds) {
      return urlIds.split(",");
    }
    // Fallback to localStorage if no URL params
    const stored = localStorage.getItem("selectedCartItems");
    return stored ? JSON.parse(stored) : [];
  }, [searchParams]);

  // Map cart items to checkout format
  const items = useMemo(() => {
    const mapItem = (item: (typeof cartItems)[0]) => {
      const product = item.product;
      const imageUrl = product?.images?.[0] || product?.image_url;

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
        price: price,
        quantity: item.quantity,
        kilo: item.kilo,
        custom_text: item.custom_text,
        additional_description: item.additional_description,
      };
    };

    if (selectedIds.length === 0) {
      // If no items selected, use all cart items
      return cartItems.map(mapItem);
    }

    // Filter only selected items
    return cartItems
      .filter((item) => selectedIds.includes(item._id))
      .map(mapItem);
  }, [cartItems, selectedIds]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Redirect if no items (but not if order was just placed)
  useEffect(() => {
    if (!isLoading && items.length === 0 && !orderPlaced) {
      router.push("/cart");
    }
  }, [isLoading, items.length, router, orderPlaced]);

  if (isLoading) {
    return <LoadingState message="Loading checkout..." />;
  }

  const handlePaymentSubmit = async (formData: {
    deliveryDate: string;
    recipientPhone: string;
    paymentProof: File | null;
  }) => {
    if (items.length === 0) {
      toast.error("No items in cart");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order items - send cart item IDs only
      // Backend will mark these existing cart items as is_ordered: true
      const orderItems: OrderItem[] = cartItems
        .filter(
          (item) => selectedIds.length === 0 || selectedIds.includes(item._id)
        )
        .map((item) => ({
          _id: item._id, // Send cart item ID
        }));

      // Convert delivery date to ISO string
      const deliveryTime = new Date(formData.deliveryDate).toISOString();

      // Create order payload
      const orderPayload = {
        order_items: orderItems,
        phone_number: formData.recipientPhone,
        delivery_time: deliveryTime,
        payment_proof_file: formData.paymentProof,
        upfront_paid: total * 0.3, // 30% upfront payment (adjust as needed)
        total_price: total,
      };

      // Validate order data with Zod
      const validation = validateSafe(orderSchema, orderPayload);

      if (!validation.success) {
        toast.error(validation.error);
        setIsSubmitting(false);
        return;
      }

      // Create the order - backend will mark the cart items as is_ordered: true
      await createOrder(validation.data);

      // Set flag to prevent redirect to cart
      setOrderPlaced(true);

      // Clear selected items from localStorage
      localStorage.removeItem("selectedCartItems");
      // Refresh cart context to get updated cart (without ordered items)
      await refreshCart();

      toast.success(getSuccessMessage("submit", "Order"));

      // Redirect to orders page
      router.push("/orders");
    } catch (error: any) {
      toast.error(
        getErrorMessage(error, "Failed to place order. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-2">
        <div>
          <div className="mb-6 sm:mb-8 md:mb-12">
            <PageHeader
              title="Checkout"
              subtitle="Complete your order and secure your delicious treats from Koket Bakery & Pastry"
            />
          </div>
          <div className="grid grid-cols-1 3xl:grid-cols-3 gap-6 sm:gap-8 mb-8 section-spacing">
            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1 order-1 3xl:order-2">
              <div className="sticky top-4 sm:top-6 lg:top-8 space-y-6">
                {/* Order Summary Card */}
                <div className="border-2 border-primary/30 rounded-xl p-6 bg-card shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    {/* Items Count */}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Items ({items.length})</span>
                      <span className="font-medium text-foreground">
                        {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                        total
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold text-foreground">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="border-t-2 border-border pt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">
                        Total Price
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    {/* Upfront Payment Box */}
                    <div className="bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/40 rounded-xl p-4 mt-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
                            <span className="text-sm font-bold text-foreground">
                              Pay Now (30%)
                            </span>
                            <span className="text-2xl font-bold text-primary">
                              ${(total * 0.3).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Required upfront payment to confirm your order
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3 border border-primary/20">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Remaining Balance
                          </span>
                          <span className="font-bold text-foreground">
                            ${(total * 0.7).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay upon delivery
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-center text-xs text-muted-foreground leading-relaxed">
                      <svg
                        className="w-4 h-4 inline mr-1 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Secure checkout • Your payment is protected
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Payment Form */}
            <div className="lg:col-span-2 order-2 2xl:order-1">
              <ContactPaymentForm
                onSubmit={handlePaymentSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Cart Items Preview */}
          {/* <div className="space-y-4 px-3 xss:px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 max-w-2xl">
          {items.map((item) => (
            <CheckoutItemPreview key={item.id} {...item} />
          ))}
        </div> */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
