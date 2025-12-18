"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Product, ProductFilters } from "../../types/product";
import HeroSection from "../components/HeroSection";
import ProductsHeader from "../components/ProductsHeader";
import ProductsGrid from "../components/ProductsGrid";
import Pagination from "../components/Pagination";
import ConfirmationModal from "../components/ConfirmationModal";
import ProductFiltersComponent from "../components/ProductFilters";
import {
  getAdminProducts,
  deleteAdminProduct,
} from "@/app/services/admin/productService";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAdminProducts(filters);
        setProducts(data as Product[]);
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
  }, [filters]);

  const totalItems = products.length;
  const currentProducts = products.slice(
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
      setProducts((prev) =>
        prev.filter((product) => product._id !== productToDelete.productId)
      );

      // Reset to first page if current page becomes empty
      const newTotalItems = products.length - 1;
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-pink-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">
            Loading products...
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            Please wait while we fetch your products
          </p>
        </div>
      </div>
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
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
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
        iconSrc="../../../../assets/User.png"
        iconAlt="products icon"
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
