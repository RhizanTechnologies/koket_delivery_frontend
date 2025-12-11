/**
 * React Query Configuration
 * Centralized configuration for React Query
 */

import { QueryClient, DefaultOptions } from "@tanstack/react-query";
import { logger } from "@/app/utils/logger";

/**
 * Default options for all queries
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: Data is considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache time: Unused data remains in cache for 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

    // Retry failed requests 2 times
    retry: 2,

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on window focus (useful for real-time updates)
    refetchOnWindowFocus: false,

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Refetch on mount if data is stale
    refetchOnMount: true,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,

    // Log mutation errors
    onError: (error) => {
      logger.error("Mutation error:", error, "ReactQuery");
    },
  },
};

/**
 * Create and configure QueryClient
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

/**
 * Query keys for consistent cache management
 */
export const queryKeys = {
  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },

  // Cart
  cart: {
    all: ["cart"] as const,
    items: () => [...queryKeys.cart.all, "items"] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters?: any) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // User/Profile
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    orders: () => [...queryKeys.user.all, "orders"] as const,
    reviews: () => [...queryKeys.user.all, "reviews"] as const,
  },

  // Reviews
  reviews: {
    all: ["reviews"] as const,
    byProduct: (productId: string) =>
      [...queryKeys.reviews.all, "product", productId] as const,
  },

  // Admin
  admin: {
    all: ["admin"] as const,
    customers: () => [...queryKeys.admin.all, "customers"] as const,
    analytics: () => [...queryKeys.admin.all, "analytics"] as const,
  },
};
