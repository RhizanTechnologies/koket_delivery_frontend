"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Product, UpdateProductDto } from "../../../../types/product";
import { productSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";

const API_BASE_URL = "http://localhost:5001";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  category_id: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Fetch product data, categories, and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product
        const productResponse = await fetch(
          `${API_BASE_URL}/api/v1/products/${id}`
        );
        if (!productResponse.ok) throw new Error("Failed to fetch product");
        const productData = await productResponse.json();
        setProduct(productData.product || productData.data || productData);

        // Fetch categories
        const categoriesResponse = await fetch(
          `${API_BASE_URL}/api/v1/categories`
        );
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(
            categoriesData.categories || categoriesData.data || categoriesData
          );
        }

        // Fetch subcategories
        const subcategoriesResponse = await fetch(
          `${API_BASE_URL}/api/v1/subcategories`
        );
        if (subcategoriesResponse.ok) {
          const subcategoriesData = await subcategoriesResponse.json();
          setSubcategories(
            subcategoriesData.subcategories ||
              subcategoriesData.data ||
              subcategoriesData
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load product data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleInputChange = (field: keyof UpdateProductDto, value: string) => {
    if (product) {
      setProduct((prev) => {
        if (!prev) return null;
        // Handle both object and string category/subcategory IDs
        if (field === "category_id") {
          return { ...prev, category_id: value };
        }
        if (field === "subcategory_id") {
          return { ...prev, subcategory_id: value };
        }
        return { ...prev, [field]: value };
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];
    const MAX_IMAGES = 10;

    // Calculate total images (existing + new)
    const currentTotal = (product?.images?.length || 0) + newImageFiles.length;
    const remainingSlots = MAX_IMAGES - currentTotal;

    if (remainingSlots <= 0) {
      alert(
        `Maximum ${MAX_IMAGES} images allowed. Please remove some images first.`
      );
      return;
    }

    for (
      let i = 0;
      i < files.length && validFiles.length < remainingSlots;
      i++
    ) {
      const file = files[i];
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    }

    if (validFiles.length > 0) {
      setNewImageFiles((prev) => [...prev, ...validFiles]);
      setNewImagePreviews((prev) => [...prev, ...previews]);
      if (files.length > remainingSlots) {
        alert(
          `Only ${validFiles.length} images added. Maximum ${MAX_IMAGES} images total allowed.`
        );
      }
    }
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAllNewImages = () => {
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setNewImageFiles([]);
    setNewImagePreviews([]);
    const fileInput = document.getElementById(
      "product-images"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);

    try {
      // Extract IDs from objects if needed
      const categoryId =
        typeof product.category_id === "object"
          ? product.category_id._id
          : product.category_id;
      const subcategoryId =
        typeof product.subcategory_id === "object" && product.subcategory_id
          ? product.subcategory_id._id
          : product.subcategory_id;

      // Validate with Zod schema
      const validation = validateSafe(productSchema, {
        name: product.name,
        description: product.description,
        categoryId,
        subcategoryId,
      });
      
      if (!validation.success) {
        toast.error(validation.error);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Append updated product data
      if (product.name) formData.append("name", product.name);
      if (product.description)
        formData.append("description", product.description);
      if (categoryId) formData.append("category_id", categoryId);
      if (subcategoryId) formData.append("subcategory_id", subcategoryId);

      // Append new image files if selected
      if (newImageFiles.length > 0) {
        newImageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      await response.json();
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Get filtered subcategories based on selected category
  const currentCategoryId =
    typeof product?.category_id === "object"
      ? product.category_id._id
      : product?.category_id;

  const filteredSubcategories = currentCategoryId
    ? subcategories.filter((sub) => sub.category_id === currentCategoryId)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
          <p className="text-sm text-gray-600 mb-6">
            Update the details of your product
          </p>

          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              value={product.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={product.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={
                typeof product.category_id === "object"
                  ? product.category_id._id
                  : product.category_id
              }
              onChange={(e) => handleInputChange("category_id", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Subcategory <span className="text-red-500">*</span>
            </label>
            <select
              value={
                typeof product.subcategory_id === "object" &&
                product.subcategory_id
                  ? product.subcategory_id._id
                  : product.subcategory_id || ""
              }
              onChange={(e) =>
                handleInputChange("subcategory_id", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
              disabled={
                !currentCategoryId || filteredSubcategories.length === 0
              }
              required
            >
              <option value="">
                {currentCategoryId && filteredSubcategories.length > 0
                  ? "Select subcategory"
                  : currentCategoryId
                  ? "No subcategories available"
                  : "Select a category first"}
              </option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Product Images
            </label>

            {/* Current Images */}
            {product.images && product.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {product.images.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`${API_BASE_URL}${imageUrl}`}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={
                (product?.images?.length || 0) + newImageFiles.length >= 10
              }
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload new images (max 5MB each). Maximum 10 images total allowed.
              Current: {(product?.images?.length || 0) + newImageFiles.length}
              /10
            </p>

            {/* New Images Preview */}
            {newImagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    {newImagePreviews.length} new image
                    {newImagePreviews.length !== 1 ? "s" : ""} to upload
                  </p>
                  <button
                    type="button"
                    onClick={clearAllNewImages}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove All New
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {newImageFiles[index]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="px-4 py-2 rounded-full border bg-white text-sm hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
