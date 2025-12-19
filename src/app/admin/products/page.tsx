"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Product, ProductFilters } from "../../types/product";
import HeroSection from "../components/HeroSection";
import ProductsHeader from "../components/ProductsHeader";
import ProductsGrid from "../components/ProductsGrid";
import Pagination from "../components/Pagination";
import ConfirmationModal from "../components/ConfirmationModal";
import ProductFiltersComponent from "../components/ProductFilters";
import LoadingState from "@/components/LoadingState";
import {
  getAdminProducts,
  deleteAdminProduct,
} from "@/app/services/admin/productService";

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    productId: string;
    productName: string;
  } | null>(null);

  // Fetch all products from API once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAdminProducts({}); // Fetch without filters
        setAllProducts(data as Product[]);
      } catch (err) {
        console.error("Error fetching products:", err);
        const message =
          err instanceof Error ? err.message : "Failed to fetch products";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Only run once on mount

  // Filter products on the frontend
  const filteredProducts = allProducts.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = product.name?.toLowerCase().includes(searchLower);
      const matchesDescription = product.description
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesName && !matchesDescription) return false;
    }

    // Category filter - check both categoryId and category_id
    const categoryFilter = filters.categoryId || filters.category_id;
    if (categoryFilter && categoryFilter !== "all") {
      const productCategoryId =
        typeof product.category_id === "object"
          ? product.category_id._id
          : product.category_id;
      if (productCategoryId !== categoryFilter) return false;
    }

    // Subcategory filter - check both subcategoryId and subcategory_id
    const subcategoryFilter = filters.subcategoryId || filters.subcategory_id;
    if (subcategoryFilter && subcategoryFilter !== "all") {
      const productSubcategoryId =
        typeof product.subcategory_id === "object"
          ? product.subcategory_id?._id
          : product.subcategory_id;
      if (productSubcategoryId !== subcategoryFilter) return false;
    }

    return true;
  });

  const totalItems = filteredProducts.length;
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddProduct = () => {
    if (typeof window !== "undefined") {
      const base = window.location.pathname.replace(/\/$/, "");
      window.location.href = `${base}/add`;
    }
  };

  const handleEditProduct = (id: string) => {
    if (typeof window !== "undefined") {
      const base = window.location.pathname.replace(/\/$/, "");
      window.location.href = `${base}/edit/${id}`;
    }
  };

  const openDeleteConfirm = (productId: string, productName: string) => {
    setProductToDelete({ productId, productName });
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setConfirmOpen(false);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteAdminProduct(productToDelete.productId);

      // Remove product from state
      setAllProducts((prev) =>
        prev.filter((product) => product._id !== productToDelete.productId)
      );

      // Reset to first page if current page becomes empty
      const newTotalItems = filteredProducts.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }

      setProductToDelete(null);
      setConfirmOpen(false);
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete product";
      setError(message);
      toast.error(message);
    }
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <LoadingState
        message="Loading products..."
        subtitle="Please wait while we fetch your products"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-2 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-6 inline-block mb-4">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <svg
              className="w-5 h-5 mr-2 inline"
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
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-2">
      <HeroSection
        title="Products"
        subtitle="Manage all products and inventory in one place"
        Icon={Package}
      />

      <main className="max-w-[1800px] mx-auto px-3 xs:px-4 md:px-6 xl:px-8 py-4 md:py-6 xl:py-8">
        <section className="bg-white border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">
          <ProductsHeader
            title="All Products"
            onAddProduct={handleAddProduct}
            filterCount={Object.keys(filters).length}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />

          {/* Filters Section */}
          {showFilters && (
            <div className="px-3 xs:px-4 md:px-6 py-4 md:py-5 border-b bg-background-2 animate-in slide-in-from-top duration-200">
              <ProductFiltersComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          <div className="p-3 xs:p-4 md:p-5 xl:p-6 2xl:p-8 bg-background-2 min-h-[400px]">
            <ProductsGrid
              products={currentProducts}
              indexOfFirstProduct={(currentPage - 1) * itemsPerPage}
              onEdit={handleEditProduct}
              onDelete={(index, productId) => {
                const product = currentProducts[index];
                openDeleteConfirm(productId, product.name);
              }}
            />
          </div>

          {/* Universal Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            variant="compact"
            className="px-3 xs:px-4 md:px-6 py-3 md:py-4 border-t bg-gray-50"
          />
        </section>
      </main>

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${productToDelete?.productName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
