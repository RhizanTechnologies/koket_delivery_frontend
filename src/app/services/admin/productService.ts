/**
 * Admin Product Service
 * Handles admin product operations
 */
import { apiClient } from "../api";
import { logger } from "@/app/utils/logger";

/** Base URL for resolving asset/image paths */
const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5001";

/**
 * Resolve image URL - converts relative paths to absolute URLs
 */
export function resolveImageUrl(path?: string): string {
  if (!path) return "/assets/placeholder-product.jpg";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_BASE_URL}${path}`;
}

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
  subcategory_id?:
    | string
    | {
        _id: string;
        name: string;
        kilo_to_price_map?: Record<string, number>;
        price?: number;
        is_pieceable?: boolean;
        upfront_payment?: number;
      };
  is_pieceable?: boolean;
  pieces?: number;
  kilo_to_price_map?: Record<string, number>;
  upfront_payment?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductRating {
  _id: string;
  user_id:
    | string
    | {
        _id: string;
        name: string;
        email?: string;
        role?: string;
      };
  product_id: string | AdminProduct;
  rating: number;
  comment: string;
  created_at: string;
}

export interface RelatedProduct extends AdminProduct {}

export interface ProductWithDetails extends AdminProduct {
  reviews?: ProductRating[];
  related_products?: RelatedProduct[];
  averageRating?: number;
  totalRatings?: number;
}

export interface Category {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  category_id: string;
  status?: string;
  kilo_to_price_map?: Record<string, number>;
  upfront_payment?: number;
  is_pieceable?: boolean;
  price?: number;
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
 * Get single product by ID with reviews and related products (Admin)
 */
export async function getAdminProductById(
  productId: string
): Promise<ProductWithDetails> {
  try {
    const { data } = await apiClient.get(`/products/${productId}`);
    const product = data.product || data.data || data;

    // Calculate average rating if reviews exist
    if (product.reviews && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (sum: number, r: ProductRating) => sum + r.rating,
        0
      );
      product.averageRating = totalRating / product.reviews.length;
      product.totalRatings = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalRatings = 0;
    }

    return product;
  } catch (error: any) {
    console.error("Failed to fetch product", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Create a new product (Admin)
 */
export async function createAdminProduct(
  formData: FormData
): Promise<AdminProduct> {
  try {
    const { data } = await apiClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.product || data.data || data;
  } catch (error: any) {
    console.error("Failed to create product", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Update a product (Admin)
 */
export async function updateAdminProduct(
  productId: string,
  formData: FormData
): Promise<AdminProduct> {
  try {
    const { data } = await apiClient.put(`/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.product || data.data || data;
  } catch (error: any) {
    console.error("Failed to update product", error?.response?.data ?? error);
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

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get("/categories");
    return data.categories || data.data || data || [];
  } catch (error: any) {
    console.error("Failed to fetch categories", error?.response?.data ?? error);
    throw error;
  }
}

/**
 * Get all subcategories
 */
export async function getSubcategories(): Promise<SubCategory[]> {
  try {
    const { data } = await apiClient.get("/subcategories");
    return data.subcategories || data.data || data || [];
  } catch (error: any) {
    console.error(
      "Failed to fetch subcategories",
      error?.response?.data ?? error
    );
    throw error;
  }
}
/**
 * Delete a product review (Admin)
 */
export async function deleteAdminReview(reviewId: string): Promise<void> {
  try {
    await apiClient.delete(`/reviews/${reviewId}`);
  } catch (error: any) {
    logger.error("Failed to delete review", error?.response?.data ?? error);
    throw error;
  }
}
