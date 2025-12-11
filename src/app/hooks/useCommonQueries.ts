"use client";

/**
 * Custom React Query Hooks for Categories and User Profile
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/config/queryClient";
import api from "@/app/services/api";
import { logger } from "@/app/utils/logger";

// Category type
interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

// User type
interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  profile?: {
    phone?: string;
    address?: string;
  };
}

// Fetch all categories
export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data as Category[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change rarely)
  });
}

// Fetch user profile
export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      const response = await api.get("/user/profile");
      return response.data as User;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const response = await api.put("/user/profile", userData);
      return response.data as User;
    },
    onSuccess: (updatedUser) => {
      // Update cache with new data
      queryClient.setQueryData(queryKeys.user.profile(), updatedUser);
      logger.info("Profile updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update profile", { error });
    },
  });
}

// Fetch user's orders (for profile page)
export function useUserOrders() {
  return useQuery({
    queryKey: queryKeys.user.orders(),
    queryFn: async () => {
      const response = await api.get("/user/orders");
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Fetch user's reviews (for profile page)
export function useUserReviews() {
  return useQuery({
    queryKey: queryKeys.user.reviews(),
    queryFn: async () => {
      const response = await api.get("/user/reviews");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
