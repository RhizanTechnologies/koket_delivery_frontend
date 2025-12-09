"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { productSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";

const API_BASE_URL = "http://localhost:5001";

interface Category {
  _id: string;
  name: string;
  subcategories?: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  category_id: string;
  status: string;
  kilo_to_price_map?: Record<string, number>;
  upfront_payment: number;
  is_pieceable: boolean;
  price: number;
  created_at: string;
}

interface CreateProductDto {
  name: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  images: string[];
  size?: string; // For weight-based products
  quantity?: number; // For pieceable products
}

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productData, setProductData] = useState<CreateProductDto>({
    name: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    images: [],
    size: "",
    quantity: 1,
  });

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubCategory | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await fetch(
          `${API_BASE_URL}/api/v1/categories`
        );
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(
          categoriesData.categories || categoriesData.data || categoriesData
        );

        // Fetch subcategories
        const subcategoriesResponse = await fetch(
          `${API_BASE_URL}/api/v1/subcategories`
        );
        if (!subcategoriesResponse.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const subcategoriesData = await subcategoriesResponse.json();
        setSubcategories(
          subcategoriesData.subcategories ||
            subcategoriesData.data ||
            subcategoriesData
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load categories and subcategories";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle subcategory selection
  useEffect(() => {
    if (productData.subcategoryId) {
      const subcategory = subcategories.find(
        (sub) => sub._id === productData.subcategoryId
      );
      setSelectedSubcategory(subcategory || null);

      // Reset size and quantity when subcategory changes
      setProductData((prev) => ({
        ...prev,
        size: "",
        quantity: 1,
      }));
    } else {
      setSelectedSubcategory(null);
    }
  }, [productData.subcategoryId, subcategories]);

  // Clear subcategory when category changes
  useEffect(() => {
    setProductData((prev) => ({
      ...prev,
      subcategoryId: "",
      size: "",
      quantity: 1,
    }));
    setSelectedSubcategory(null);
  }, [productData.categoryId]);

  const handleInputChange = (
    field: keyof CreateProductDto,
    value: string | number
  ) => {
    setProductData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];
    const MAX_IMAGES = 10;

    // Check if adding new files would exceed the limit
    const remainingSlots = MAX_IMAGES - imageFiles.length;
    if (remainingSlots <= 0) {
      setError(
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

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(`${file.name} is not a valid image file`);
        continue;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} exceeds 5MB size limit`);
        continue;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...previews]);
      if (files.length > remainingSlots) {
        setError(
          `Only ${validFiles.length} images added. Maximum ${MAX_IMAGES} images allowed.`
        );
      } else {
        setError(null);
      }
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      // Revoke URL to free memory
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setError(null);
  };

  const clearAllImages = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);
    const fileInput = document.getElementById(
      "product-images"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    setError(null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Image will be uploaded as part of FormData in handleSubmit
    // This function is no longer needed but kept for compatibility
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate with Zod schema
      const validation = validateSafe(productSchema, {
        name: productData.name,
        description: productData.description,
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId,
        size: productData.size,
        quantity: productData.quantity,
      });
      
      if (!validation.success) {
        setError(validation.error);
        toast.error(validation.error);
        setSubmitting(false);
        return;
      }

      // Additional validation based on subcategory type
      if (!selectedSubcategory?.is_pieceable && !productData.size) {
        const message = "Please select a size for this product";
        setError(message);
        toast.error(message);
        setSubmitting(false);
        return;
      }

      if (
        selectedSubcategory?.is_pieceable &&
        (!productData.quantity || productData.quantity < 1)
      ) {
        const message = "Please enter a valid quantity";
        setError(message);
        toast.error(message);
        setSubmitting(false);
        return;
      }
      // Prepare FormData for image upload
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("category_id", productData.categoryId);
      formData.append("subcategory_id", productData.subcategoryId);

      // Add multiple images if selected
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Add size for weight-based products
      if (
        selectedSubcategory &&
        !selectedSubcategory.is_pieceable &&
        productData.size
      ) {
        formData.append("size", productData.size);
      }

      // Add quantity/pieces for pieceable products
      if (
        selectedSubcategory &&
        selectedSubcategory.is_pieceable &&
        productData.quantity
      ) {
        formData.append("pieces", productData.quantity.toString());
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      await response.json();
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create product";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      categoryId: "",
      subcategoryId: "",
      images: [],
      size: "",
      quantity: 1,
    });
    setSelectedSubcategory(null);
    clearAllImages();
    setError(null);
  };

  // Get filtered subcategories based on selected category
  const filteredSubcategories = productData.categoryId
    ? subcategories.filter((sub) => sub.category_id === productData.categoryId)
    : [];

  // Get available sizes for weight-based products
  const availableSizes = selectedSubcategory?.kilo_to_price_map
    ? Object.keys(selectedSubcategory.kilo_to_price_map)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
          <p className="mt-6 text-gray-700 font-medium text-lg">
            Loading form...
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            Fetching categories and subcategories
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 xs:py-6 md:py-8 px-3 xs:px-4 md:px-6 xl:px-8">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 xs:p-5 md:p-6 xl:p-8 2xl:p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="mb-8">
            <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <svg
                className="w-8 h-8 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Product
            </h1>
            <p className="text-sm text-gray-600">
              Fill in the details to add a new product to your shop
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm animate-in slide-in-from-top duration-200">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium flex-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              value={productData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Chocolate Cake, Vanilla Cupcakes, etc."
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={productData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your product in detail...\ne.g., Delicious chocolate cake with rich frosting, perfect for celebrations."
              rows={5}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-gray-400 resize-none"
              required
            />
          </div>

          {/* Category & Subcategory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={productData.categoryId}
                onChange={(e) =>
                  handleInputChange("categoryId", e.target.value)
                }
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                value={productData.subcategoryId}
                onChange={(e) =>
                  handleInputChange("subcategoryId", e.target.value)
                }
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                disabled={
                  !productData.categoryId || filteredSubcategories.length === 0
                }
                required
              >
                <option value="">
                  {productData.categoryId && filteredSubcategories.length > 0
                    ? "Select subcategory"
                    : productData.categoryId
                    ? "No subcategories available"
                    : "Select a category first"}
                </option>
                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}{" "}
                    {subcategory.is_pieceable
                      ? "(Pieceable)"
                      : "(Weight-based)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subcategory Information */}
          {selectedSubcategory && (
            <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Subcategory Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                  <span className="text-gray-600 block mb-1 text-xs font-medium">
                    Type:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedSubcategory.is_pieceable
                      ? "🍰 Pieceable"
                      : "⚖️ Weight-based"}
                  </span>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                  <span className="text-gray-600 block mb-1 text-xs font-medium">
                    Upfront Payment:
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${selectedSubcategory.upfront_payment}
                  </span>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                  <span className="text-gray-600 block mb-1 text-xs font-medium">
                    Base Price:
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${selectedSubcategory.price}
                  </span>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                  <span className="text-gray-600 block mb-1 text-xs font-medium">
                    Status:
                  </span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {selectedSubcategory.status === "active"
                      ? "✅ Active"
                      : selectedSubcategory.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Size Selection for Weight-based Products */}
          {selectedSubcategory &&
            !selectedSubcategory.is_pieceable &&
            availableSizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={productData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                >
                  <option value="">Select a size</option>
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size} - ${selectedSubcategory.kilo_to_price_map![size]}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Quantity for Pieceable Products */}
          {selectedSubcategory && selectedSubcategory.is_pieceable && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity (Pieces) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={productData.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value))
                }
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="Enter number of pieces"
                required
              />
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Product Images
            </label>

            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                imageFiles.length >= 10
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                  : "border-pink-300 bg-pink-50/30 hover:border-pink-400 hover:bg-pink-50/50 cursor-pointer"
              }`}
            >
              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={imageFiles.length >= 10}
                className="hidden"
              />
              <label
                htmlFor="product-images"
                className={
                  imageFiles.length >= 10
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }
              >
                <div className="flex flex-col items-center gap-3">
                  {imageFiles.length >= 10 ? (
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-16 h-16 text-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                  <div>
                    <p className="text-base font-semibold text-gray-700 mb-1">
                      {imageFiles.length >= 10
                        ? "Image Limit Reached"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {imageFiles.length >= 10
                        ? "Maximum 10 images reached. Remove some to add more."
                        : "JPG, PNG, WebP up to 5MB each"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        imageFiles.length >= 10
                          ? "bg-red-100 text-red-700"
                          : imageFiles.length > 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {imageFiles.length} / 10 images
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-pink-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {imagePreviews.length} image
                    {imagePreviews.length !== 1 ? "s" : ""} selected
                  </p>
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="group relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-pink-300 transition-all hover:shadow-lg"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 hover:bg-red-600 shadow-lg"
                            title="Remove image"
                          >
                            <svg
                              className="w-5 h-5"
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
                        </div>
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50">
                        <p
                          className="text-xs text-gray-600 truncate font-medium"
                          title={imageFiles[index]?.name}
                        >
                          {imageFiles[index]?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(imageFiles[index]?.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="w-full md:w-auto px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={submitting}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Form
            </button>
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Product...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
