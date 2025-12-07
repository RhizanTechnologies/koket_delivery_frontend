"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSearch, FaBars } from "react-icons/fa";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getCategories } from "@/app/services/categoryService";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ✅ Define flexible Category type from backend
export type Category = {
  _id: string;
  name: string;
  description?: string;
  subcategories?: { name: string }[];
};

// ✅ Define filters with dynamic types
type ProductFilters = {
  category: string;
  subcategory: string;
  search: string;
  sort: string;
};

type ProductFiltrationProps = {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
};

const sortOptions = [
  { label: "Price", value: "name" },
  { label: "Low to High", value: "priceAsc" },
  { label: "High to Low", value: "priceDesc" },
];

export default function ProductFiltration({
  filters,
  setFilters,
}: ProductFiltrationProps) {
  const { category, subcategory, search, sort } = filters;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch categories dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getCategories();
        // Ensure fallback in case API structure differs
        const formatted = Array.isArray(data)
          ? data
          : data && typeof data === "object" && Array.isArray(data.categories)
          ? data.categories
          : [];

        setCategories([
          { _id: "all", name: "All Products", subcategories: [] },
          ...formatted,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
        setCategories([
          { _id: "all", name: "All Products", subcategories: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Get subcategories of current category
  const currentSubcategories =
    categories
      .find((cat) => cat.name === category)
      ?.subcategories?.map((s) => s.name) || [];

  // ✅ Keep subcategory consistent
  useEffect(() => {
    if (subcategory && !currentSubcategories.includes(subcategory)) {
      setFilters((prev) => ({
        ...prev,
        subcategory: currentSubcategories[0] || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (loading) {
    return (
      <LoadingState
        message="Loading categories…"
        fullScreen={false}
        className="py-16"
      />
    );
  }

  // ✅ UI (unchanged)
  return (
    <div className="bg-background-2 px-3 xss:px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pt-6">
      <div className="max-w-7xl ">
        {/* Mobile */}
        <div className="mb-6 block 2xl:hidden">
          <div className="flex justify-between items-center">
            <Link
              href="#"
              onClick={() => setFilters((prev) => ({ ...prev, category }))}
              className="px-4 py-2 rounded-t-xl border-b-2 border-primary bg-primary/20 text-primary font-bold text-sm"
            >
              {category}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 border-b-2 border-primary bg-primary/20 text-primary rounded-t-md py-1 px-3 text-sm font-medium"
                >
                  <FaBars />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories
                  .filter((c) => c.name !== category)
                  .map((c) => (
                    <DropdownMenuItem
                      key={c._id}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category: c.name,
                          subcategory: "",
                        }))
                      }
                    >
                      {c.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden 2xl:flex gap-4 overflow-x-auto no-scrollbar mb-6 py-2">
          {categories.map((cat) => (
            <Button
              key={cat._id}
              variant={category === cat.name ? "default" : "secondary"}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  category: cat.name,
                  subcategory: "",
                }))
              }
              className={`px-4 py-2 rounded-lg font-semibold shadow text-sm transition ${
                category === cat.name
                  ? "bg-primary text-white"
                  : "bg-white text-foreground shadow-md"
              }`}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Search + Sort + Subcategory */}
        <div className="grid grid-cols-2 2xl:grid-cols-5 gap-3 items-center">
          {/* Search */}
          <div className="col-span-2 2xl:col-span-3">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-6 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder={`Search ${category.toLowerCase()}...`}
                value={search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-14 pr-6 py-6 text-lg bg-white border rounded-lg"
              />
            </div>
          </div>
          {/* Sort */}
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white border rounded-lg px-2 md:px-4 py-3 flex items-center justify-between"
                >
                  <span className="line-clamp-1">
                    {sortOptions.find((s) => s.value === sort)?.label ||
                      "Sort by"}
                  </span>
                  <span className="ml-2 text-foreground">&#9662;</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sortOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, sort: opt.value }))
                    }
                  >
                    {opt.label}
                    {sort === opt.value && (
                      <span className="ml-auto text-green-600">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subcategory */}
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white border rounded-lg px-2 md:px-4 py-3 flex items-center justify-between"
                >
                  <span className="line-clamp-1">
                    {subcategory || "All Products"}
                  </span>
                  <span className="ml-2 text-gray-600">&#9662;</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {currentSubcategories.length > 0 ? (
                  currentSubcategories.map((sub) => (
                    <DropdownMenuItem
                      key={sub}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, subcategory: sub }))
                      }
                    >
                      {sub}
                      {subcategory === sub && (
                        <span className="ml-auto text-green-600">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No subcategories</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
