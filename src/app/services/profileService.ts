import { apiClient as api } from "./api";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  googleId?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  __v?: number;
  stats: {
    totalOrders: number;
    totalSpending: number;
    recentRatings: any[];
  };
}

export interface ProfileResponse {
  message: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  googleId: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  __v: number;
  stats: {
    totalOrders: number;
    totalSpending: number;
    recentRatings: any[];
  };
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const { data } = await api.get<ProfileResponse>("/users/profile");

    console.log("Fetched user profile:", data);
    // Transform response to UserProfile format
    return {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      googleId: data.googleId,
      phone_number: data.phone_number,
      created_at: data.created_at,
      updated_at: data.updated_at,
      __v: data.__v,
      stats: data.stats,
    };
  } catch (error: any) {
    console.error(
      "Failed to fetch user profile",
      error?.response?.data ?? error
    );
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  name?: string;
  email?: string;
  phone_number?: string;
}): Promise<{ message: string; user: UserProfile }> {
  try {
    const { data } = await api.put<{ message: string; user: UserProfile }>(
      "/users/profile",
      updates
    );

    return data;
  } catch (error: any) {
    console.error("Failed to update profile", error?.response?.data ?? error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update profile";
    throw new Error(errorMessage);
  }
}

/**
 * Change user password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  try {
    const { data: response } = await api.put<{ message: string }>(
      "/users/profile",
      {
        password: data.newPassword,
      }
    );

    return response;
  } catch (error: any) {
    console.error("Failed to change password", error?.response?.data ?? error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to change password";
    throw new Error(errorMessage);
  }
}
