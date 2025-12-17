/**
 * Cart Service
 * Handles shopping cart operations
 */
import type { ProductSummary } from "@/app/types/product";
import { apiClient } from "./api";

export interface AddToCartPayload {
  product_id: string;
  quantity: number;
  kilo?: number;
  pieces?: number;
  custom_text?: string;
  additional_description?: string;
}

export interface CartItem {
  _id: string;
  user_id?: string;
  product_id: string | ProductSummary;
  /** Populated product data from backend */
  product?: ProductSummary;
  kilo?: number;
  pieces?: number;
  quantity: number;
  custom_text?: string;
  additional_description?: string;
  created_at?: string;
}

interface CartItemsResponse {
  message?: string;
  cartItems: CartItem[];
}

interface CartMutationResponse {
  message?: string;
}

/**
 * Add item to cart
 */
export async function addToCart(payload: any) {
  try {
    const { data } = await apiClient.post<CartMutationResponse>(
      "/orders/items",
      payload
    );
    return data;
  } catch (error: any) {
    console.error("Failed to add item to cart", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Get cart items
 */
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const { data } = await apiClient.get<CartItem[] | CartItemsResponse>(
      "/orders/items/user"
    );
    // Handle both response formats: array directly or object with cartItems property
    if (Array.isArray(data)) {
      return data;
    }
    return data.cartItems ?? [];
  } catch (error: any) {
    console.error("Failed to fetch cart items", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Update cart item
 */
export async function updateCartItem(
  id: string,
  payload: Partial<AddToCartPayload>
) {
  try {
    const { data } = await apiClient.put<CartMutationResponse>(
      `/orders/items/${id}`,
      payload
    );
    return data;
  } catch (error: any) {
    console.error("Failed to update cart item", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(id: string) {
  try {
    const { data } = await apiClient.delete<CartMutationResponse>(
      `/orders/items/${id}`
    );
    return data;
  } catch (error: any) {
    console.error(
      "Failed to remove item from cart",
      error?.response?.data ?? error
    );
    throw error;
  }
}

/**
 * Clear all cart items
 */
export async function clearCart() {
  try {
    const { data } = await apiClient.delete<CartMutationResponse>(
      "/orders/items"
    );
    return data;
  } catch (error: any) {
    console.error("Failed to clear cart", error?.response?.data ?? error);
    throw error;
  }
}
