/**
 * Product Service
 * Handles product-related API calls
 */
import type { ProductDetail, ProductSummary } from "@/app/types/product";
import { apiClient as api } from "./api";
import { logger } from "@/app/utils/logger";

interface ProductsResponse {
  message: string;
  products: ProductSummary[];
}

interface ProductResponse {
  message: string;
  product: ProductDetail;
}

interface ReviewPayload {
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
}

interface ReviewResponse {
  message: string;
}

/**
 * Get all products
 */
export async function getProducts(): Promise<ProductSummary[]> {
  try {
    const { data } = await api.get<ProductsResponse>("/products");
    return data.products;
  } catch (error: any) {
    logger.error("Failed to fetch products", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<ProductDetail> {
  try {
    const { data } = await api.get<ProductResponse>(`/products/${id}`);
    return data.product;
  } catch (error: any) {
    logger.error(
      `Failed to fetch product ${id}`,
      error?.response?.data ?? error
    );
    throw error;
  }
}

/**
 * Create product review
 */
export async function createProductReview(payload: ReviewPayload) {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please login to submit a review");
    }

    const { data } = await api.post<ReviewResponse>("/reviews", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    logger.error("Failed to submit review", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Update product review
 */
export async function updateProductReview(
  id: string,
  payload: Partial<ReviewPayload>
) {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please login to update your review");
    }

    const { data } = await api.patch<ReviewResponse>(`/reviews/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    logger.error(`Failed to update review ${id}`, error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Delete product review
 */
export async function deleteProductReview(id: string) {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please login to delete your review");
    }

    const { data } = await api.delete<ReviewResponse>(`/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    logger.error(`Failed to delete review ${id}`, error?.response?.data ?? error);
    throw error;
  }
}
