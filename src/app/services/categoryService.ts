import { apiClient } from "./api";
import { logger } from "@/app/utils/logger";
import {
  Category,
  SubCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from "@/app/types/category";

// Normalize API payload shape
const normalizeCategoryList = (data: any): Category[] =>
  data?.categories || data?.data || data || [];

const normalizeCategory = (data: any): Category =>
  data?.category || data?.data || data;

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiClient.get("/categories");
    return normalizeCategoryList(res.data);
  } catch (error: any) {
    logger.error("Error fetching categories:", error);
    throw new Error("Failed to load categories");
  }
};

export const createCategory = async (
  payload: CreateCategoryDto
): Promise<Category> => {
  try {
    const res = await apiClient.post("/categories", payload);
    return normalizeCategory(res.data);
  } catch (error: any) {
    logger.error("Error creating category:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create category"
    );
  }
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryDto
): Promise<Category> => {
  try {
    const res = await apiClient.put(`/categories/${id}`, payload);
    return normalizeCategory(res.data);
  } catch (error: any) {
    logger.error("Error updating category:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to update category"
    );
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (error: any) {
    logger.error("Error deleting category:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to delete category"
    );
  }
};

export const createSubCategory = async (
  payload: CreateSubCategoryDto
): Promise<SubCategory> => {
  try {
    const res = await apiClient.post("/subcategories", payload);
    return res.data?.subCategory || res.data?.data || res.data;
  } catch (error: any) {
    logger.error("Error creating sub-category:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create sub-category"
    );
  }
};

export const updateSubCategory = async (
  id: string,
  payload: UpdateSubCategoryDto
): Promise<SubCategory> => {
  try {
    const res = await apiClient.put(`/subcategories/${id}`, payload);
    return res.data?.subCategory || res.data?.data || res.data;
  } catch (error: any) {
    logger.error("Error updating sub-category:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to update sub-category"
    );
  }
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/subcategories/${id}`);
  } catch (error: any) {
    logger.error("Error deleting sub-category:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to delete sub-category"
    );
  }
};
