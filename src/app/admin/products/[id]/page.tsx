"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaEdit, FaStar, FaArrowLeft, FaUser } from "react-icons/fa";
import {
  getAdminProductById,
  resolveImageUrl,
  type ProductWithDetails,
  type ProductRating,
} from "@/app/services/admin/productService";

export default function AdminProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || typeof id !== "string") return;

      try {
        setLoading(true);
        const productData = await getAdminProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get reviews from product
  const reviews = product?.reviews || [];

  // Get all images
  const productImages =
    product?.images && product.images.length > 0
      ? product.images.map((img) => resolveImageUrl(img))
      : product?.image_url
      ? [resolveImageUrl(product.image_url)]
      : ["/assets/placeholder-product.png"];

  // Use calculated average from service or calculate locally
  const averageRating = product?.averageRating ?? 0;
  const totalRatings = product?.totalRatings ?? reviews.length;

  // Get available sizes
  const availableSizes = product?.kilo_to_price_map
    ? Object.keys(product.kilo_to_price_map)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
          <p className="mt-6 text-gray-700 font-medium text-lg">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/admin/products")}
            className="px-6 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-6 px-4 md:px-6 xl:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Products</span>
          </Link>
          <button
            onClick={() => router.push(`/admin/products/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaEdit />
            Edit Product
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-6 bg-gray-50">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-inner">
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/placeholder-product.png";
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-pink-500 shadow-lg"
                          : "border-transparent hover:border-pink-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6 lg:p-8">
              {/* Category Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {typeof product.category_id === "object" &&
                  product.category_id && (
                    <span className="inline-flex items-center text-xs px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full font-medium">
                      {product.category_id.name}
                    </span>
                  )}
                {typeof product.subcategory_id === "object" &&
                  product.subcategory_id && (
                    <span className="inline-flex items-center text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {product.subcategory_id.name}
                    </span>
                  )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {averageRating.toFixed(1)} ({totalRatings} review
                  {totalRatings !== 1 ? "s" : ""})
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description || "No description available"}
              </p>

              {/* Pricing */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Available Sizes & Prices
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSizes.map((size) => (
                      <div
                        key={size}
                        className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                      >
                        <span className="block text-sm text-gray-600">
                          {size}
                        </span>
                        <span className="block text-lg font-bold text-pink-600">
                          {formatPrice(product.kilo_to_price_map![size])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upfront Payment */}
              {product.upfront_payment && product.upfront_payment > 0 && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-amber-700 font-medium">
                    Upfront Payment Required:
                  </span>
                  <span className="text-amber-900 font-bold">
                    {formatPrice(product.upfront_payment)}
                  </span>
                </div>
              )}

              {/* Product Type */}
              {product.is_pieceable && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-blue-700 font-medium">
                    Sold by pieces
                  </span>
                  {product.pieces && (
                    <span className="text-blue-900 font-bold">
                      ({product.pieces} pcs available)
                    </span>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                {product.created_at && (
                  <p>Created: {formatDate(product.created_at)}</p>
                )}
                {product.updated_at && (
                  <p>Last Updated: {formatDate(product.updated_at)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              Customer Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FaStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm">
                  This product hasn't received any reviews
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <FaUser className="text-pink-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {typeof review.user_id === "object"
                              ? review.user_id.name
                              : "Anonymous User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {review.comment || "No comment provided"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
