import { apiClient } from "./api";
import { logger } from "@/app/utils/logger";

export interface Subcategory {
  _id: string;
  name: string;
  status: string;
  is_pieceable: boolean;
  price?: number;
  kilo_to_price_map?: Record<string, number>;
}
export interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiClient.get("/categories");
    return res.data.categories;
  } catch (error: any) {
    logger.error("Error fetching categories:", error);
    throw new Error("Failed to load categories");
  }
};
