"use client";

/**
 * Custom React Query Hooks for Cart
 * Provides cached cart data with optimistic updates for better UX
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/config/queryClient";
import api from "@/app/services/api";
import { CartItem } from "@/app/services/cartService";
import { logger } from "@/app/utils/logger";

// Fetch cart items
export function useCartQuery() {
  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: async () => {
      const response = await api.get("/cart");
      return response.data as CartItem[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute (cart changes frequently)
  });
}

// Add item to cart with optimistic update
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Partial<CartItem>) => {
      const response = await api.post("/cart", item);
      return response.data as CartItem;
    },
    // Optimistic update - update cache immediately
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<CartItem[]>(
        queryKeys.cart.all
      );

      // Optimistically update cache
      if (previousCart) {
        queryClient.setQueryData<CartItem[]>(queryKeys.cart.all, (old = []) => [
          ...old,
          { ...newItem, _id: `temp-${Date.now()}` } as CartItem,
        ]);
      }

      return { previousCart };
    },
    onSuccess: () => {
      logger.info("Item added to cart");
    },
    // If mutation fails, rollback
    onError: (error, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCart);
      }
      logger.error("Failed to add item to cart", { error });
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

// Remove item from cart with optimistic update
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/cart/${itemId}`);
      return itemId;
    },
    // Optimistic update
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });

      const previousCart = queryClient.getQueryData<CartItem[]>(
        queryKeys.cart.all
      );

      // Remove item from cache
      if (previousCart) {
        queryClient.setQueryData<CartItem[]>(
          queryKeys.cart.all,
          previousCart.filter((item) => item._id !== itemId)
        );
      }

      return { previousCart };
    },
    onSuccess: () => {
      logger.info("Item removed from cart");
    },
    onError: (error, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCart);
      }
      logger.error("Failed to remove item from cart", { error });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

// Update cart item quantity with optimistic update
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data as CartItem;
    },
    // Optimistic update
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });

      const previousCart = queryClient.getQueryData<CartItem[]>(
        queryKeys.cart.all
      );

      // Update quantity in cache
      if (previousCart) {
        queryClient.setQueryData<CartItem[]>(
          queryKeys.cart.all,
          previousCart.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          )
        );
      }

      return { previousCart };
    },
    onSuccess: () => {
      logger.info("Cart item updated");
    },
    onError: (error, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCart);
      }
      logger.error("Failed to update cart item", { error });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete("/cart");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });

      const previousCart = queryClient.getQueryData<CartItem[]>(
        queryKeys.cart.all
      );

      // Clear cart in cache
      queryClient.setQueryData<CartItem[]>(queryKeys.cart.all, []);

      return { previousCart };
    },
    onSuccess: () => {
      logger.info("Cart cleared");
    },
    onError: (error, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCart);
      }
      logger.error("Failed to clear cart", { error });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}
