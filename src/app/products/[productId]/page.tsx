"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "../components/ReviewForm";
import { ProductDetails } from "../components/ProductDetails";
import dynamic from "next/dynamic";
import {
  createProductReview,
  getProductById,
} from "@/app/services/productService";
import { addToCart, type AddToCartPayload } from "@/app/services/cartService";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import type { ProductDetail, ProductSummary } from "@/app/types/product";
import ProductCard from "@/components/ProductCard";
import LoadingState from "@/components/LoadingState";

const ProductGallery = dynamic(() =>
  import("../components/ProductGallery").then((mod) => mod.ProductGallery)
);

const ReviewsList = dynamic(() =>
  import("../components/ReviewsList").then((mod) => mod.ReviewsList)
);
const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5001";

const currencyFormatter = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

const resolveImageUrl = (path?: string) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${ASSET_BASE_URL}${path}`;
};

export default function ProductPage() {
  const params = useParams<{ productId: string }>();
  const { refreshCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const productId = params?.productId?.toString();

  useEffect(() => {
    if (!productId) {
      setError("Missing product identifier.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getProductById(productId)
      .then((data) => {
        if (cancelled) return;

        const related = Array.isArray(data.related_products)
          ? data.related_products
          : [];
        const reviews = Array.isArray(data.reviews) ? data.reviews : [];

        const normalizedReviews = reviews.map((review) => {
          const productRef = review.product_id;
          const normalizedProduct =
            typeof productRef === "string"
              ? productRef
              : {
                  ...productRef,
                  image_url: resolveImageUrl(productRef.image_url),
                };

          return {
            ...review,
            product_id: normalizedProduct,
          };
        });

        const resolvedProduct: ProductDetail = {
          ...data,
          image_url: resolveImageUrl(data.image_url),
          images: data.images
            ?.map((img) => resolveImageUrl(img))
            .filter((img): img is string => !!img),
          related_products: related.map((item) => ({
            ...item,
            image_url: resolveImageUrl(item.image_url),
            images: item.images
              ?.map((img) => resolveImageUrl(img))
              .filter((img): img is string => !!img),
          })),
          reviews: normalizedReviews,
        };

        setProduct(resolvedProduct);
        setRelatedProducts(resolvedProduct.related_products);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load product details.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId, refreshIndex]);

  const galleryImages = useMemo(() => {
    // Prioritize images array, fallback to single image_url
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    if (product?.image_url) {
      return [product.image_url];
    }
    return [];
  }, [product?.images, product?.image_url]);

  const computePriceLabel = (item: ProductSummary) => {
    const kiloValues = item.kilo_to_price_map
      ? Object.values(item.kilo_to_price_map)
      : [];
    const firstPrice =
      item.price ?? (kiloValues.length ? kiloValues[0] : undefined);
    return typeof firstPrice === "number"
      ? currencyFormatter.format(firstPrice)
      : "Price on request";
  };

  if (loading) {
    return <LoadingState message="Loading product details…" />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background-2 px-4">
        <Card className="max-w-md p-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">{error}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <Button
            className="mt-4"
            onClick={() => setRefreshIndex((prev) => prev + 1)}
          >
            Retry
          </Button>
        </Card>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background-2">
        <p className="text-sm text-muted-foreground">Product not found.</p>
      </main>
    );
  }

  const categoryName = product.category_id?.name ?? "";
  const subcategoryName = product.subcategory_id?.name ?? "";
  const categoryLabel = [categoryName, subcategoryName]
    .filter(Boolean)
    .join(" / ");
  const reviews = product.reviews ?? [];
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + (typeof review.rating === "number" ? review.rating : 0),
          0
        ) / totalReviews
      : 0;
  const ratingValue = Math.min(5, Math.max(0, Math.round(averageRating)));

  const handleReviewSubmit = async ({
    rating,
    comment,
  }: {
    rating: number;
    comment: string;
    name?: string;
  }) => {
    if (!productId) {
      setReviewError("Missing product identifier.");
      return;
    }

    if (!user?.id) {
      setReviewError("Please login to submit a review.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      setReviewError(null);

      const payload = {
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
      };

      await createProductReview(payload);
      setShowReviewForm(false);
      setRefreshIndex((prev) => prev + 1);
    } catch (submitError: any) {
      const apiMessage =
        submitError?.response?.data?.message ??
        submitError?.message ??
        "Unable to submit review. Please try again.";
      setReviewError(apiMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-2">
      {/* Breadcrumb Navigation */}
      <div className="bg-background pt-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 sm:py-4 text-sm ">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
            <span className="text-muted-foreground">/</span>
            <a
              href="/products"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <section className="mx-auto max-w-7xl px-4 py-3  sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:gap-12 2xl:grid-cols-2">
          <Suspense
            fallback={
              <LoadingState
                message="Loading gallery…"
                fullScreen={false}
                className="min-h-[320px]"
              />
            }
          >
            <ProductGallery images={galleryImages} name={product.name} />
          </Suspense>

          <ProductDetails product={product} onCartUpdate={refreshCart} />
        </div>
      </section>

      {/* Reviews Section */}
      <section className=" bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-16 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">
                Customer Reviews
              </h2>
              <p className="text-sm text-muted-foreground">
                {totalReviews > 0
                  ? `${totalReviews} review${
                      totalReviews === 1 ? "" : "s"
                    } • ${averageRating.toFixed(1)} average rating`
                  : "Be the first to review this product"}
              </p>
            </div>
            <Button
              onClick={() => setShowReviewForm((prev) => !prev)}
              disabled={isSubmittingReview}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg w-full sm:w-auto"
            >
              {showReviewForm ? "Cancel" : "+ Write a Review"}
            </Button>
          </div>

          {showReviewForm && (
            <div className="mb-8 bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
              <ReviewForm
                onSubmit={handleReviewSubmit}
                defaultRating={Math.max(1, ratingValue || 5)}
                isSubmitting={isSubmittingReview}
              />
              {reviewError && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {reviewError}
                  </p>
                </div>
              )}
            </div>
          )}

          <Suspense
            fallback={
              <LoadingState
                message="Loading reviews…"
                fullScreen={false}
                className="py-12"
              />
            }
          >
            <ReviewsList reviews={reviews} />
          </Suspense>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-16 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            You May Also Like
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover more delicious options handpicked for you
          </p>
        </div>
        {relatedProducts.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => {
              // Determine the price to display based on product type
              let displayPrice = "Contact for Price";

              // Check if product has kilo_to_price_map (sold by weight)
              if (
                product.kilo_to_price_map &&
                Object.keys(product.kilo_to_price_map).length > 0
              ) {
                const prices = Object.values(product.kilo_to_price_map);
                const minPrice = Math.min(...prices);
                displayPrice = `ETB ${minPrice.toFixed(2)}`;
              }
              // Check if product is pieceable (sold per piece with subcategory price)
              else if (product.is_pieceable && product.subcategory_id?.price) {
                displayPrice = `ETB ${product.subcategory_id.price.toFixed(2)}`;
              }

              return (
                <ProductCard
                  key={product._id}
                  image={product.image_url || "/assets/img1.png"}
                  name={product.name}
                  description={product.description ?? ""}
                  price={displayPrice}
                  category={product.category_id?.name}
                  productId={product._id}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 sm:p-12 text-center">
            <div className="mx-auto max-w-sm">
              <div className="mb-3 text-4xl">🍰</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Related Products Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check back soon for more delicious recommendations
              </p>
              <a
                href="/products"
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                Browse All Products →
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
