import { Product } from "../../types/product";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import { resolveImageUrl } from "@/app/services/admin/productService";

interface ProductCardProps {
  product: Product;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  // Get available sizes from kilo_to_price_map
  const availableSizes = product.kilo_to_price_map
    ? Object.keys(product.kilo_to_price_map)
    : [];

  // Get all images (prioritize images array, fallback to image_url)
  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => resolveImageUrl(img))
      : product.image_url
      ? [resolveImageUrl(product.image_url)]
      : ["/assets/placeholder-product.png"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img
          src={productImages[currentImageIndex]}
          alt={`${product.name} - ${currentImageIndex + 1}`}
          className="w-full h-48 xs:h-52 md:h-56 lg:h-60 xl:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/placeholder-product.png";
          }}
        />

        {/* Image navigation */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              title="Previous image"
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-3.5 h-3.5 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              title="Next image"
              aria-label="Next image"
            >
              <FaChevronRight className="w-3.5 h-3.5 text-gray-800" />
            </button>

            {/* Image indicator dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all ${
                    index === currentImageIndex
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/60 hover:bg-white/80"
                  } rounded-full`}
                  title={`Image ${index + 1}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3 xs:p-4 md:p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg xs:text-xl md:text-2xl mb-2 line-clamp-2 text-gray-900">
          {product.name}
        </h3>

        {/* Category and Subcategory */}
        <div className="flex flex-wrap gap-2 mb-3">
          {typeof product.category_id === "object" && product.category_id && (
            <span className="inline-flex items-center text-xs px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-200 font-medium">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              {product.category_id.name}
            </span>
          )}
          {typeof product.subcategory_id === "object" &&
            product.subcategory_id && (
              <span className="inline-flex items-center text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200 font-medium">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                {product.subcategory_id.name}
              </span>
            )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || "No description available"}
        </p>

        {/* Price Information */}
        <div className="mb-4 flex-grow">
          {/* Upfront Payment */}
          {product.upfront_payment && product.upfront_payment > 0 && (
            <div className="flex items-center gap-2 mb-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <svg
                className="w-4 h-4 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold text-amber-800">
                Upfront: {formatPrice(product.upfront_payment)}
              </span>
            </div>
          )}

          {/* Available Sizes */}
          {availableSizes.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Available Sizes:
              </p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const sizePrice = product.kilo_to_price_map![size];
                  return (
                    <span
                      key={size}
                      className="px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200 rounded-lg text-xs font-medium hover:border-pink-300 transition-colors"
                    >
                      {size}: {formatPrice(sizePrice)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pieceable Indicator */}
          {product.is_pieceable && (
            <div className="flex items-center gap-1.5 mt-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs font-semibold">
                Sold by pieces {product.pieces ? `(${product.pieces} pcs)` : ""}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all hover:shadow-md group/btn"
            aria-label="View product"
            title="View Details"
          >
            <FaEye className="text-base group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden lg:inline">View</span>
          </button>

          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-all hover:shadow-md group/btn"
            aria-label="Edit product"
            title="Edit Product"
          >
            <FaEdit className="text-base group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden lg:inline">Edit</span>
          </button>

          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:shadow-md group/btn"
            aria-label="Delete product"
            title="Delete Product"
          >
            <FaTrash className="text-base group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden lg:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
