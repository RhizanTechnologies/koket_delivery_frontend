/**
 * Admin User Service
 * Handles all user management API calls for admin
 */
import { apiClient } from "../api";
import { logger } from "@/app/utils/logger";

export interface UserRating {
  product: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

export interface UserStatsData {
  totalOrders: number;
  totalSpending: number;
  recentRatings: UserRating[];
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
  profile_image?: string;
  googleId?: string;
  created_at?: string;
  updated_at?: string;
  stats?: UserStatsData;
}

export interface CustomerWithStats {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  created_at: string;
  totalOrders: number;
  totalSpent: number;
}

/**
 * Get all users (Admin only)
 * GET /api/v1/users
 */
export const getAllCustomers = async (): Promise<CustomerWithStats[]> => {
  try {
    const response = await apiClient.get("/users");
    const users = response.data.users || response.data;

    return users.map((user: any) => ({
      _id: user._id || user.id,
      id: user._id || user.id,
      name: user.name || "Unknown",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      created_at: user.created_at || user.createdAt || new Date().toISOString(),
      totalOrders: user.totalOrders || user.total_orders || 0,
      totalSpent: user.totalSpent || user.total_spent || 0,
    }));
  } catch (error: any) {
    logger.error("Failed to fetch customers:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch customers"
    );
  }
};

/**
 * Get user by ID (Admin only)
 * GET /api/v1/users/:id
 */
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.user || response.data;
  } catch (error: any) {
    logger.error("Failed to fetch user:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error: any) {
    logger.error("Failed to delete user:", error);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone_number?: string;
}

/**
 * Get current user profile
 * GET /api/v1/users/profile
 */
export const getAdminProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get("/users/profile");
    return response.data.user || response.data;
  } catch (error: any) {
    logger.error("Failed to fetch profile:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

/**
 * Update current user profile
 * PUT /api/v1/users/profile
 */
export const updateAdminProfile = async (
  payload: UpdateProfilePayload
): Promise<User> => {
  try {
    const response = await apiClient.put("/users/profile", payload);
    return response.data.user || response.data;
  } catch (error: any) {
    logger.error("Failed to update profile:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

/**
 * Upload profile image
 * PUT /api/v1/users/profile/image (multipart/form-data)
 */
export const uploadProfileImage = async (file: File): Promise<User> => {
  try {
    const form = new FormData();
    form.append("profile_image", file);

    const response = await apiClient.put("/users/profile/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.user || response.data;
  } catch (error: any) {
    logger.error("Failed to upload profile image:", error);
    throw new Error(
      error.response?.data?.message || "Failed to upload profile image"
    );
  }
};
