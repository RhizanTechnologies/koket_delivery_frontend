/**
 * Admin Analytics Service
 * Handles all analytics-related API calls for admin dashboard
 */
import { apiClient } from "../api";
import { logger } from "@/app/utils/logger";

export interface AnalyticsResponse {
  total_orders: number;
  total_revenue: number;
  total_upfront_collected: number;
  orders_by_status: {
    pending: number;
    accepted: number;
    rejected: number;
    completed: number;
  };
  top_categories: Array<{
    category_id: string;
    category_name: string;
    order_count: number;
    revenue: number;
  }>;
  top_products: Array<{
    product_id: string;
    product_name: string;
    order_count: number;
    revenue: number;
    average_rating: number;
  }>;
  customer_metrics: {
    new_customers: number;
    returning_customers: number;
    total_customers: number;
  };
  average_rating: number;
  upcoming_deliveries: number;
  revenue_trend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface DashboardOverview {
  today: AnalyticsResponse;
  weekly: AnalyticsResponse;
  monthly: AnalyticsResponse;
  comparison: {
    revenue_growth: number;
    order_growth: number;
    customer_growth: number;
  };
}

export interface ProductPerformance {
  product_id: string;
  product_name: string;
  total_orders: number;
  total_revenue: number;
  average_rating: number;
  review_count: number;
  conversion_rate: number;
}

export interface CategoryPerformance {
  category_id: string;
  category_name: string;
  total_orders: number;
  total_revenue: number;
  product_count: number;
  average_rating: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface CustomerAnalytics {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  customers: Array<{
    _id: string;
    id: string;
    name: string;
    email: string;
    total_orders: number;
    total_spent: number;
    created_at: string;
  }>;
}

/**
 * Get dashboard overview (Admin only)
 */
export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const response = await apiClient.get("/analytics/dashboard");
    return response.data;
  } catch (error: any) {
    logger.error("Failed to fetch dashboard overview:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard"
    );
  }
};

/**
 * Get analytics data with filters
 */
export const getAnalyticsData = async (params?: {
  start_date?: string;
  end_date?: string;
  period?: "daily" | "weekly" | "monthly";
}): Promise<AnalyticsResponse> => {
  try {
    const response = await apiClient.get("/analytics/data", { params });
    return response.data;
  } catch (error: any) {
    logger.error("Failed to fetch analytics data:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch analytics"
    );
  }
};

/**
 * Get product performance
 */
export const getProductPerformance = async (
  productId?: string
): Promise<ProductPerformance[]> => {
  try {
    const params = productId ? { product_id: productId } : {};
    const response = await apiClient.get("/analytics/products/performance", {
      params,
    });
    return response.data;
  } catch (error: any) {
    logger.error("Failed to fetch product performance:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product performance"
    );
  }
};

/**
 * Get category performance
 */
export const getCategoryPerformance = async (): Promise<
  CategoryPerformance[]
> => {
  try {
    const response = await apiClient.get("/analytics/categories/performance");
    return response.data;
  } catch (error: any) {
    logger.error("Failed to fetch category performance:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch category performance"
    );
  }
};

/**
 * Get revenue trend
 */
export const getRevenueTrend = async (params?: {
  start_date?: string;
  end_date?: string;
}): Promise<RevenueTrend[]> => {
  try {
    const response = await apiClient.get("/analytics/revenue/trend", {
      params,
    });
    return response.data;
  } catch (error: any) {
    logger.error("Failed to fetch revenue trend:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch revenue trend"
    );
  }
};

/**
 * Get customer analytics
 */
export const getCustomerAnalytics = async (): Promise<CustomerAnalytics> => {
  try {
    const response = await apiClient.get("/analytics/customers");
    return response.data;
  } catch (error: any) {
    logger.error("Failed to fetch customer analytics:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch customer analytics"
    );
  }
};
