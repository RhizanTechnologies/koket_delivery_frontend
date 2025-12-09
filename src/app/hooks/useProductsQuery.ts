"use client";

/**
 * Custom React Query Hooks for Products
 * Provides cached product data fetching with automatic refetching
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/config/queryClient";
import api from "@/app/services/api";
import { Product } from "@/app/types/product";
import { logger } from "@/app/utils/logger";

// Fetch all products
export function useProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data as Product[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch single product by ID
export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      const response = await api.get(`/products/${id}`);
      return response.data as Product;
    },
    enabled: !!id, // Only run query if ID exists
  });
}

// Fetch products by category
export function useProductsByCategoryQuery(categoryId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.list({ category: categoryId }),
    queryFn: async () => {
      if (!categoryId) throw new Error("Category ID is required");
      const response = await api.get(`/products?category=${categoryId}`);
      return response.data as Product[];
    },
    enabled: !!categoryId,
  });
}

// Create product mutation (admin)
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const response = await api.post("/products", productData);
      return response.data as Product;
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      logger.info("Product created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create product", { error });
    },
  });
}

// Update product mutation (admin)
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Product>;
    }) => {
      const response = await api.put(`/products/${id}`, data);
      return response.data as Product;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific product and list
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      logger.info("Product updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update product", { error });
    },
  });
}

// Delete product mutation (admin)
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache and refetch list
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      logger.info("Product deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete product", { error });
    },
  });
}
