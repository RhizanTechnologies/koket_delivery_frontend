import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { setupApiLogger } from "@/app/utils/apiLogger";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// Setup API request/response logging
setupApiLogger(apiClient);

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh for 401 errors that haven't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            // Call refresh endpoint
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            // Extract tokens and user from response
            const { tokens, user } = response.data;

            // Store new tokens
            localStorage.setItem("accessToken", tokens.accessToken);
            if (tokens.refreshToken) {
              localStorage.setItem("refreshToken", tokens.refreshToken);
            }

            // Update user data if provided
            if (user) {
              localStorage.setItem("user", JSON.stringify(user));
            }

            // Retry original request with new access token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            }
            return apiClient(originalRequest);
          } else {
            // No refresh token available, clear auth state
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            // Redirect to login if not already on auth page
            if (!window.location.pathname.startsWith("/auth")) {
              window.location.href = "/auth/login";
            }
          }
        }
      } catch (refreshError: any) {
        // Refresh failed (expired or invalid refresh token)
        console.error(
          "Token refresh failed:",
          refreshError.response?.data || refreshError.message
        );

        if (typeof window !== "undefined") {
          // Clear all auth data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          // Force logout and redirect to login
          if (!window.location.pathname.startsWith("/auth")) {
            window.location.href = "/auth/login?session=expired";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Manually refresh the access token using refresh token
 * @param refreshToken - The refresh token
 * @returns Promise with user and tokens
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}> {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });
  return response.data;
}

export default apiClient;
