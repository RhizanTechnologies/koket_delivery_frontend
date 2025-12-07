import { apiClient as api } from "./api";
import { logger } from "@/app/utils/logger";

export interface OrderItem {
  _id: string; // Cart item ID - backend will mark this as is_ordered: true
}

export interface CreateOrderPayload {
  order_items: OrderItem[]; // Array of cart item IDs
  phone_number: string;
  delivery_time: string; // ISO date string
  payment_proof_file: File;
  upfront_paid: number;
  total_price: number;
}

export interface OrderItemDetail {
  _id: string;
  user_id: string;
  kilo?: number;
  pieces?: number;
  quantity: number;
  custom_text?: string;
  additional_description?: string;
  created_at?: string;
  __v?: number;
  product?: {
    _id: string;
    name: string;
    image_url?: string;
    images?: string[];
    category_id: string;
    subcategory_id: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    __v?: number;
  };
}

export interface Order {
  _id: string;
  order_items: OrderItemDetail[];
  user_id: string;
  phone_number: string;
  total_price: number;
  upfront_paid: number;
  payment_proof_url?: string;
  delivery_time: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  rejection_comment?: string;
  created_at?: string;
  updated_at?: string;
  __v?: number;
}

interface OrderResponse {
  message: string;
  order?: any;
}

/**
 * Get all orders for the current user
 */
export async function getUserOrders(): Promise<Order[]> {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please login to view orders");
    }

    const { data } = await api.get<Order[]>("/orders/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    logger.error("Failed to fetch orders", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please login to view order details");
    }

    const { data } = await api.get<Order>(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    logger.error("Failed to fetch order", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Create a new order
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<OrderResponse> {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please login to place an order");
    }

    // Create FormData
    const formData = new FormData();

    // Add order_items as JSON string
    formData.append("order_items", JSON.stringify(payload.order_items));

    // Add phone number
    formData.append("phone_number", payload.phone_number);

    // Add delivery time
    formData.append("delivery_time", payload.delivery_time);

    // Add payment proof file
    formData.append("payment_proof_file", payload.payment_proof_file);

    // Add upfront payment amount
    formData.append("upfront_paid", payload.upfront_paid.toString());

    // Add total price
    formData.append("total_price", payload.total_price.toString());

    const { data } = await api.post<OrderResponse>("/orders", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error: any) {
    logger.error("Failed to create order", error?.response?.data ?? error);
    throw error;
  }
}
