"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PageHeader, ProductCard } from "@/components";
import ProductFiltration from "./components/ProductFiltration";
import { ProductFilters } from "../types/ProductFilters";
import { getProducts } from "@/app/services/productService";
import type { ProductSummary } from "@/app/types/product";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";

const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5001";

const PAGE_SIZE = 12;

function ProductsPage() {
  const [allProducts, setAllProducts] = useState<ProductSummary[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    category: "All Products",
    subcategory: "All Subcategories",
    search: "",
    sort: "name",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setAllProducts(data);
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

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Category filter
    if (filters.category !== "All Products") {
      products = products.filter(
        (p) =>
          p.category_id?.name?.trim().toLowerCase() ===
          filters.category.trim().toLowerCase()
      );
    }

    // Subcategory filter
    if (filters.subcategory && filters.subcategory !== "All Subcategories") {
      products = products.filter(
        (p) =>
          p.subcategory_id?.name?.trim().toLowerCase() ===
          filters.subcategory.trim().toLowerCase()
      );
    }

    // Search filter
    if (filters.search.trim() !== "") {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          (p.name ?? "").toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
      );
    }

    const getEffectivePrice = (product: ProductSummary) => {
      // prefer product kilo map, fallback to subcategory kilo map
      const kiloMap =
        product.kilo_to_price_map ?? product.subcategory_id?.kilo_to_price_map;

      if (kiloMap && Object.keys(kiloMap).length > 0) {
        // get the cheapest kilo price
        return Math.min(...Object.values(kiloMap));
      }

      // fallback to normal price
      return product.price ?? 0;
    };

    // Sorting
    if (filters.sort === "priceAsc") {
      products.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (filters.sort === "priceDesc") {
      products.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  }, [filters, allProducts]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => setPage(1), [filters]);

  if (loading) {
    return <LoadingState message="Loading products…" />;
  }

  return (
    <div className="bg-background-2 min-h-screen">
      <div>
        <div className="mb-2 sm:mb-5 md:mb-6">
          {" "}
          <PageHeader
            title="Our Products"
            subtitle="Discover our handcrafted cakes and delicious desserts made with love"
          />
        </div>

        <ProductFiltration filters={filters} setFilters={setFilters} />

        <div className="section-spacing-x pb-10 mt-8 bg-background-2">
          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center min-h-[400px] py-12">
              <div className="max-w-md w-full text-center">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800">
                  <svg
                    className="w-10 h-10 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Oops! Something Went Wrong
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!error && paginatedProducts.length === 0 && (
            <div className="flex items-center justify-center min-h-[500px] py-12">
              <div className="max-w-md w-full text-center">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  No Products Found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  We couldn't find any products matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <Button
                  onClick={() =>
                    setFilters({
                      category: "All Products",
                      subcategory: "All Subcategories",
                      search: "",
                      sort: "name",
                    })
                  }
                  className="px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl inline-flex items-center gap-2"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!error && paginatedProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => {
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
                else if (
                  product.is_pieceable &&
                  product.subcategory_id?.price
                ) {
                  displayPrice = `ETB ${product.subcategory_id.price.toFixed(
                    2
                  )}`;
                }

                return (
                  <ProductCard
                    key={product._id}
                    image={
                      product.image_url
                        ? `${ASSET_BASE_URL}${product.image_url}`
                        : "/assets/img1.png"
                    }
                    name={product.name}
                    description={product.description ?? ""}
                    price={displayPrice}
                    category={product.category_id?.name}
                    productId={product._id}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {!error && totalPages > 1 && (
        <div className="section-spacing-x pb-2">
          <div className="flex flex-col-reverse justify-center items-center gap-4 py-6 sm:py-8 bg-card ">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">
                Page {page} of {totalPages}
              </span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline">
                {filteredProducts.length} products
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                className="w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-lg bg-card border-2  border-border text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 hover:border-primary transition-all flex items-center justify-center gap-2"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page Numbers - Show max 3 on mobile, 5 on larger screens */}
              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      window.innerWidth < 640 ? 2 : 3
                    ),
                  },
                  (_, i) => {
                    let pageNum;
                    const maxPages = window.innerWidth < 640 ? 2 : 3;

                    if (totalPages <= maxPages) {
                      pageNum = i + 1;
                    } else if (page <= Math.ceil(maxPages / 2)) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - Math.floor(maxPages / 2)) {
                      pageNum = totalPages - maxPages + 1 + i;
                    } else {
                      pageNum = page - Math.floor(maxPages / 2) + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        className={`w-9 h-9 xl:w-10 xl:h-10 rounded-lg font-bold transition-all text-sm sm:text-base ${
                          page === pageNum
                            ? "bg-primary text-primary-foreground shadow-lg scale-110"
                            : "bg-card border-2 border-border text-foreground hover:bg-primary/10 hover:border-primary"
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              {/* Next Button */}
              <Button
                className="w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-lg bg-card border-2 border-border text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 hover:border-primary transition-all flex items-center justify-center gap-2"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <span className="hidden sm:inline">Next</span>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
