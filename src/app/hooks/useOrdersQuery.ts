"use client";

/**
 * Custom React Query Hooks for Orders
 * Provides cached order data fetching with automatic refetching
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/config/queryClient";
import api from "@/app/services/api";
import { Order } from "@/app/types/order";
import { logger } from "@/app/utils/logger";

// Fetch user's orders
export function useOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: async () => {
      const response = await api.get("/orders");
      return response.data as Order[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (orders change more frequently)
  });
}

// Fetch single order by ID
export function useOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Order ID is required");
      const response = await api.get(`/orders/${id}`);
      return response.data as Order;
    },
    enabled: !!id,
  });
}

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      const response = await api.post("/orders", orderData);
      return response.data as Order;
    },
    onSuccess: () => {
      // Invalidate orders list and cart
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      logger.info("Order created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create order", { error });
    },
  });
}

// Update order mutation (admin)
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
      const response = await api.put(`/orders/${id}`, data);
      return response.data as Order;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific order and list
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      logger.info("Order updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update order", { error });
    },
  });
}

// Cancel order mutation
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(`/orders/${id}/cancel`);
      return response.data as Order;
    },
    onSuccess: (_, id) => {
      // Invalidate specific order and list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      logger.info("Order cancelled successfully");
    },
    onError: (error) => {
      logger.error("Failed to cancel order", { error });
    },
  });
}
