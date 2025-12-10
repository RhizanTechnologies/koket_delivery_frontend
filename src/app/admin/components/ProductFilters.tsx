import { useState, useEffect } from "react";
import { ProductFilters as ProductFiltersType } from "../../types/product";
import { Button } from "@/components/ui/button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: ProductFiltersType) => void;
  onClearFilters: () => void;
}

interface Category {
  _id: string;
  name: string;
  subcategories?: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  category_id: string;
}

export default function ProductFiltersComponent({
  filters,
  onFilterChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and subcategories for filter options
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch(
          `${API_BASE_URL}/api/v1/categories`
        );
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(
            categoriesData.categories || categoriesData.data || categoriesData
          );
        }

        // Fetch subcategories
        const subcategoriesResponse = await fetch(
          `${API_BASE_URL}/api/v1/subcategories`
        );
        if (subcategoriesResponse.ok) {
          const subcategoriesData = await subcategoriesResponse.json();
          setSubcategories(
            subcategoriesData.subcategories ||
              subcategoriesData.data ||
              subcategoriesData
          );
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { ...filters, categoryId: categoryId || undefined };
    // Clear subcategory when category changes
    delete newFilters.subcategoryId;
    onFilterChange(newFilters);
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    onFilterChange({
      ...filters,
      subcategoryId: subcategoryId || undefined,
    });
  };

  // Get subcategories for the selected category
  const filteredSubcategories = filters.categoryId
    ? subcategories.filter((sub) => sub.category_id === filters.categoryId)
    : [];

  const hasActiveFilters = filters.categoryId || filters.subcategoryId;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        <span className="ml-3 text-sm text-gray-600 font-medium">
          Loading filters...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter Products
        </h3>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 font-medium transition-colors"
            size="sm"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.categoryId || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all hover:border-gray-300"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subcategory
          </label>
          <select
            value={filters.subcategoryId || ""}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            disabled={!filters.categoryId || filteredSubcategories.length === 0}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all hover:border-gray-300"
          >
            <option value="">All Subcategories</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          {filters.categoryId && filteredSubcategories.length === 0 && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              No subcategories available for this category
            </p>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500 mr-1">
            Active filters:
          </span>
          {filters.categoryId && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700 border border-pink-200">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              {categories.find((c) => c._id === filters.categoryId)?.name}
              <button
                onClick={() => handleCategoryChange("")}
                className="ml-2 text-pink-600 hover:text-pink-800 font-bold"
                aria-label="Remove category filter"
              >
                ×
              </button>
            </span>
          )}
          {filters.subcategoryId && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              {subcategories.find((s) => s._id === filters.subcategoryId)?.name}
              <button
                onClick={() => handleSubcategoryChange("")}
                className="ml-2 text-purple-600 hover:text-purple-800 font-bold"
                aria-label="Remove subcategory filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
