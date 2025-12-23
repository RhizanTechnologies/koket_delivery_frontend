import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { ProductSummary } from "@/app/types/product";

interface RelatedProductsProps {
  products?: ProductSummary[];
}

const FALLBACK_PRODUCTS: ProductSummary[] = [];

export function RelatedProducts({ products }: RelatedProductsProps) {
  const items = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No related products found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((product) => {
        const kiloPrices = product.kilo_to_price_map
          ? Object.values(product.kilo_to_price_map)
          : [];
        const firstPrice = product.price ?? kiloPrices[0];
        const priceLabel = firstPrice
          ? `ETB ${firstPrice}`
          : "Price on request";

        return (
          <Card
            key={product._id}
            className="overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="overflow-hidden bg-muted">
              <img
                src={product.image_url || "/assets/placeholder-product.jpg"}
                alt={product.name}
                className="h-48 w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-muted-foreground" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">(0)</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {priceLabel}
                </span>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
