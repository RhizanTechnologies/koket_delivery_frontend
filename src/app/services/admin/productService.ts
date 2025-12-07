/**
 * Admin Product Service
 * Handles admin product operations
 */
import { apiClient } from "../api";
import { logger } from "@/app/utils/logger";

export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
}

export interface AdminProduct {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  image_url?: string;
  category_id?: string | { _id: string; name: string };
  subcategory_id?: string | { _id: string; name: string };
  is_pieceable?: boolean;
  kilo_to_price_map?: Record<string, number>;
  created_at?: string;
  updated_at?: string;
}

interface ProductsResponse {
  products?: AdminProduct[];
  data?: AdminProduct[];
}

/**
 * Get all products (Admin)
 */
export async function getAdminProducts(
  filters?: ProductFilters
): Promise<AdminProduct[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.subcategoryId)
      params.append("subcategoryId", filters.subcategoryId);

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";

    const { data } = await apiClient.get<ProductsResponse | AdminProduct[]>(
      url
    );

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }
    return data.products || data.data || [];
  } catch (error: any) {
    logger.error(
      "Failed to fetch admin products",
      error?.response?.data ?? error
    );
    throw error;
  }
}

/**
 * Delete a product (Admin)
 */
export async function deleteAdminProduct(productId: string): Promise<void> {
  try {
    await apiClient.delete(`/products/${productId}`);
  } catch (error: any) {
    logger.error("Failed to delete product", error?.response?.data ?? error);
    throw error;
  }
}
