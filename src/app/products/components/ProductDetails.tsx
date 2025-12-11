"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addToCart, type AddToCartPayload } from "@/app/services/cartService";
import type { ProductDetail } from "@/app/types/product";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { getErrorMessage, getSuccessMessage } from "@/app/utils/errorHandler";
import { addToCartSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";

const currencyFormatter = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

type WeightOption = {
  id: string;
  label: string;
  price?: number;
};

const formatWeightLabel = (raw: string) => {
  const normalized = raw.trim().toLowerCase();
  if (normalized.endsWith("kg") || normalized.endsWith("g")) {
    return raw;
  }
  const numeric = Number(normalized);
  if (!Number.isNaN(numeric)) {
    return numeric >= 1 ? `${numeric} kg` : `${numeric * 1000} g`;
  }
  return raw;
};

const buildWeightOptions = (product: ProductDetail): WeightOption[] => {
  const entries = Object.entries(product.kilo_to_price_map ?? {});
  if (entries.length) {
    return entries.map(([key, value]) => ({
      id: key,
      label: formatWeightLabel(key),
      price: typeof value === "number" ? value : Number(value),
    }));
  }
  return [];
};

const parseKiloValue = (input?: string) => {
  if (!input) return undefined;
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return undefined;
  const numeric = Number(cleaned);
  return Number.isNaN(numeric) ? undefined : numeric;
};

interface ProductDetailsProps {
  product: ProductDetail;
  onCartUpdate?: () => void;
}

export function ProductDetails({ product, onCartUpdate }: ProductDetailsProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const weightOptions = buildWeightOptions(product);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption | null>(
    weightOptions[0] ?? null
  );
  const [message, setMessage] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.info("Please log in to add items to your cart");
      router.push("/auth/login");
      return;
    }

    // Validation: for weight-based products, ensure a weight is selected
    if (
      product?.kilo_to_price_map &&
      Object.keys(product.kilo_to_price_map).length > 0
    ) {
      if (!selectedWeight) {
        toast.error("Please select a weight option.");
        return;
      }
    }

    setIsAddingToCart(true);

    try {
      const payload: AddToCartPayload = {
        product_id: product._id,
        quantity: 1, // Default quantity
      };

      // Add kilo for weight-based products (is_pieceable: false)
      if (
        product?.kilo_to_price_map &&
        Object.keys(product.kilo_to_price_map).length > 0
      ) {
        const kiloValue = parseKiloValue(selectedWeight?.id);
        if (typeof kiloValue === "number") {
          payload.kilo = kiloValue;
        }
      }

      // Add optional custom text (message on cake)
      if (message.trim()) {
        payload.custom_text = message.trim();
      }

      // Add optional additional description
      if (additionalDescription.trim()) {
        payload.additional_description = additionalDescription.trim();
      }

      // Validate input data with Zod before sending to API
      const validation = validateSafe(addToCartSchema, payload);

      if (!validation.success) {
        toast.error(validation.error);
        setIsAddingToCart(false);
        return;
      }

      await addToCart(validation.data);
      toast.success(getSuccessMessage("add", "Item"));

      // Clear form
      setMessage("");
      setAdditionalDescription("");

      // Notify parent to refresh cart
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, "Failed to add item to cart");
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product title and category */}
      <div>
        <p className="text-sm text-muted-foreground">{categoryLabel}</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          {product.description}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4"
              style={{
                fill: i < ratingValue ? "#FFD700" : "transparent",
                color: i < ratingValue ? "#FFD700" : "#d1d5db",
              }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {totalReviews > 0
            ? `(${totalReviews} review${totalReviews === 1 ? "" : "s"})`
            : "No reviews yet"}
        </span>
      </div>

      {/* Price Display */}
      <div className="border-t border-b border-border py-6">
        {product.kilo_to_price_map &&
        Object.keys(product.kilo_to_price_map).length > 0 ? (
          // Product sold by weight (is_pieceable: false)
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-primary">
                {selectedWeight?.price
                  ? currencyFormatter.format(selectedWeight.price)
                  : "Select weight"}
              </span>
              {selectedWeight && (
                <span className="text-sm text-muted-foreground">
                  for {selectedWeight.label}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Pricing varies by weight selection
            </p>
          </div>
        ) : product.is_pieceable && product.subcategory_id?.price ? (
          // Normal product with fixed price (is_pieceable: true)
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-primary">
                {currencyFormatter.format(product.subcategory_id.price)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Fixed price product</p>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold text-muted-foreground mb-2">
              Contact for Price
            </div>
            <p className="text-sm text-muted-foreground">
              Please contact us for pricing information
            </p>
          </div>
        )}
      </div>

      {/* Weight selector - only show if kilo_to_price_map exists (is_pieceable: false) */}
      <div className="flex flex-col gap-6">
        {product.kilo_to_price_map &&
          Object.keys(product.kilo_to_price_map).length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-card-foreground">
                Select Weight
              </label>
              <Select
                value={selectedWeight?.id ?? ""}
                onValueChange={(value) => {
                  const next = weightOptions.find(
                    (option) => option.id === value
                  );
                  setSelectedWeight(next ?? null);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose weight" />
                </SelectTrigger>
                <SelectContent>
                  {weightOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center justify-between gap-4">
                        <span>{option.label}</span>
                        {typeof option.price === "number" && (
                          <span className="text-primary font-semibold">
                            {currencyFormatter.format(option.price)}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

        {/* Message on cake */}
        <div className="w-full flex-1">
          <label className="mb-2 block text-sm font-medium">
            Message on cake (Optional)
          </label>
          <Textarea
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="e.g. Happy Birthday!"
          />
        </div>

        {/* Additional instructions */}
        <div className="flex flex-col gap-2">
          <label className="mb-2 block text-sm font-medium">
            Additional instructions (Optional)
          </label>
          <Textarea
            rows={3}
            value={additionalDescription}
            onChange={(event) => setAdditionalDescription(event.target.value)}
            placeholder="Allergies, delivery notes, or decoration details"
          />
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        size="lg"
        className="w-full sm:w-auto"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
      </Button>
    </div>
  );
}
