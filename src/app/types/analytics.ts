import { Types } from "mongoose";

export type Period = "daily" | "weekly" | "monthly";

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  pending: number;
  accepted: number;
  rejected: number;
  completed: number;
}

export interface TopCategory {
  category_id: Types.ObjectId | string;
  category_name: string;
  order_count: number;
  revenue: number;
}

export interface TopProduct {
  product_id: Types.ObjectId | string;
  product_name: string;
  order_count: number;
  revenue: number;
  average_rating: number;
}

export interface CustomerMetrics {
  new_customers: number;
  returning_customers: number;
  total_customers: number;
}

export interface AnalyticsResponseDTO {
  total_orders: number;
  total_revenue: number;
  total_upfront_collected: number;
  orders_by_status: OrdersByStatus;
  top_categories: TopCategory[];
  top_products: TopProduct[];
  customer_metrics: CustomerMetrics;
  average_rating: number;
  upcoming_deliveries: number;
  revenue_trend: RevenueTrendPoint[];
}

export interface DashboardOverviewDTO {
  today: AnalyticsResponseDTO;
  weekly: AnalyticsResponseDTO;
  monthly: AnalyticsResponseDTO;
  comparison: {
    revenue_growth: number;
    order_growth: number;
    customer_growth: number;
  };
}

export interface ProductPerformanceDTO {
  product_id: Types.ObjectId | string;
  product_name: string;
  total_orders: number;
  total_revenue: number;
  average_rating: number;
  review_count: number;
  conversion_rate: number;
}

export interface CategoryPerformanceDTO {
  category_id: Types.ObjectId | string;
  category_name: string;
  total_orders: number;
  total_revenue: number;
  product_count: number;
  average_rating: number;
}

export interface AnalyticsQueryDTO {
  start_date?: string; // ISO date string
  end_date?: string;
  period?: Period;
  category_id?: string;
  product_id?: string;
}
