"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import FeaturedProductCard from "./FeaturedProductCard";
import { Button } from "./ui/button";
import Header from "./Header";
import Link from "next/link";
import { getProducts } from "@/app/services/productService";
import type { ProductSummary } from "@/app/types/product";
import LoadingState from "@/components/LoadingState";

const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5001";

function FeaturedSection() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        const message = "Failed to load products.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => products.slice(0, 20), [products]);

  if (loading) {
    return (
      <section className="bg-background section-spacing-y">
        <div className="section-container">
          <div className="text-center mb-10">
            <Header text="Featured Products" />
          </div>
          <LoadingState
            message="Loading featured products…"
            fullScreen={false}
            className="h-[320px]"
          />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background section-spacing-y">
        <div className="section-container">
          <div className="text-center mb-10">
            <Header text="Featured Products" />
          </div>
          <p className="text-center py-16 text-destructive text-base md:text-lg">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-background via-background/50 to-background section-spacing-y relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="section-spacing-x relative z-10">
        {/* Section header with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Handpicked Selection
            </span>
          </div>
          <Header text="Featured Products" />
          <p className="mt-3 xs:mt-4 text-muted-foreground text-sm xs:text-base md:text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of the finest baked goods, crafted
            with love and premium ingredients
          </p>
        </motion.div>

        {/* Horizontal scrolling products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mb-12 sm:mb-14 md:mb-16"
        >
          {/* Scroll container */}
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-6 md:gap-8 lg:gap-10 w-max">
              {visibleProducts.map((product) => {
                // Determine the price to display based on product type
                let displayPrice = "Contact for Price";

                // Check if product has kilo_to_price_map (sold by weight)
                if (
                  product.kilo_to_price_map &&
                  Object.keys(product.kilo_to_price_map).length > 0
                ) {
                  const prices = Object.values(product.kilo_to_price_map);
                  const minPrice = Math.min(...prices);
                  displayPrice = `From $${minPrice.toFixed(2)}`;
                }
                // Check if product is pieceable (sold per piece with subcategory price)
                else if (
                  product.is_pieceable &&
                  product.subcategory_id?.price
                ) {
                  displayPrice = `$${product.subcategory_id.price.toFixed(2)}`;
                }

                // Prepare images array
                const productImages = [];
                if (product.images && product.images.length > 0) {
                  // Use images array if available
                  productImages.push(
                    ...product.images.map((img) => `${ASSET_BASE_URL}${img}`)
                  );
                } else if (product.image_url) {
                  // Fallback to single image_url
                  productImages.push(`${ASSET_BASE_URL}${product.image_url}`);
                } else {
                  // Fallback to placeholder
                  productImages.push("/assets/img1.png");
                }

                // Get category name
                const categoryName =
                  typeof product.category_id === "object" &&
                  product.category_id?.name
                    ? product.category_id.name
                    : "Bakery";

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="w-80 sm:w-96 flex-shrink-0"
                  >
                    <FeaturedProductCard
                      images={productImages}
                      name={product.name}
                      description={
                        product.description ?? "Freshly baked with love."
                      }
                      price={displayPrice}
                      category={categoryName}
                      productId={product._id}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Scroll indicator hint */}
          <div className="flex justify-center mt-4 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowRight className="w-4 h-4 animate-pulse" />
              <span>Scroll to see more</span>
            </div>
          </div>
        </motion.div>

        {/* View all button with enhanced design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link href="/products">
            <Button
              size="lg"
              className="group relative text-sm xss:text-base md:text-lg font-semibold px-6 xss:px-8 md:px-12 py-5 xss:py-6 md:py-7 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Animated background gradient */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary bg-[length:200%_100%] animate-gradient"></span>

              <span className="relative flex items-center gap-2">
                View All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedSection;
