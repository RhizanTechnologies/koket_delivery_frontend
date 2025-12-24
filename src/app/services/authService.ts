/**
 * Authentication Service
 * Handles login, registration, and auth-related API calls
 */
import { apiClient } from "./api";
import { logger } from "@/app/utils/logger";

// Types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Login user
 */
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  } catch (error: any) {
    logger.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Register new user
 */
export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  } catch (error: any) {
    logger.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  refreshToken: string
): Promise<{
  user: User;
  tokens: AuthTokens;
}> => {
  try {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  } catch (error: any) {
    logger.error(
      "Token refresh failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Logout user (clear local storage)
 */
export const logoutUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

/**
 * Verify if user has admin role (server-side check)
 * This prevents role manipulation via localStorage
 * 
 * ⚠️ REQUIRES BACKEND ENDPOINT: GET /api/v1/auth/verify-admin
 * See BACKEND_IMPLEMENTATION.md for details
 */
export const verifyAdminRole = async (): Promise<{
  isAdmin: boolean;
  user?: User;
}> => {
  try {
    const response = await apiClient.get<{
      isAdmin: boolean;
      user?: User;
    }>("/auth/verify-admin");
    return response.data;
  } catch (error: any) {
    logger.error(
      "Admin verification failed:",
      error.response?.data || error.message
    );
    // If request fails (401, 403, etc), user is not admin
    return { isAdmin: false };
  }
};
