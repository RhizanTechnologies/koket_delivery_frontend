"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/LoadingState";
import {
  Category,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from "../../types/category";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../../services/categoryService";
import HeroSection from "../components/HeroSection";
import CategoryForm from "../components/CategoryForm";
import SubCategoryForm, {
  SubCategoryFormData,
} from "../components/SubCategoryForm";
import CategoriesGrid from "../components/CategoriesGrid";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [addingSubCategory, setAddingSubCategory] = useState<Category | null>(
    null
  );
  const [editingSubCategory, setEditingSubCategory] = useState<{
    category: Category;
    subCategoryId: string;
    subCategoryData: any;
  } | null>(null);

  // Delete modals
  const [deleteCategoryModal, setDeleteCategoryModal] =
    useState<Category | null>(null);
  const [deleteSubCategoryModal, setDeleteSubCategoryModal] = useState<{
    category: Category;
    subCategoryId: string;
  } | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        const message =
          err instanceof Error ? err.message : "Failed to fetch data";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add new category
  const handleAddCategory = async (name: string) => {
    try {
      const newCategory = await createCategory({
        name: name.trim(),
        description: `Category for ${name}`,
      });

      setCategories((prev) => [...prev, newCategory]);
      setIsCategoryModalOpen(false);
      toast.success("Category created successfully!");
    } catch (err) {
      console.error("Error creating category:", err);
      const message =
        err instanceof Error ? err.message : "Failed to create category";
      setError(message);
      toast.error(message);
    }
  };

  // Edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleUpdateCategory = async (name: string) => {
    if (!editingCategory) return;

    try {
      const updateCategoryDto = {
        name: name.trim(),
        description: `Updated category for ${name}`,
      };

      const updatedCategory = await updateCategory(
        editingCategory._id,
        updateCategoryDto
      );
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === editingCategory._id
            ? {
                ...cat,
                ...updatedCategory,
              }
            : cat
        )
      );
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
      toast.success("Category updated successfully!");
    } catch (err) {
      console.error("Error updating category:", err);
      const message =
        err instanceof Error ? err.message : "Failed to update category";
      setError(message);
      toast.error(message);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!deleteCategoryModal) return;

    try {
      await deleteCategory(deleteCategoryModal._id);
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== deleteCategoryModal._id)
      );
      setDeleteCategoryModal(null);
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error("Error deleting category:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete category";
      setError(message);
      toast.error(message);
    }
  };

  // Add sub-category
  const handleAddSubCategory = (category: Category) => {
    setAddingSubCategory(category);
    setIsSubCategoryModalOpen(true);
  };

  const handleCreateSubCategory = async (formData: SubCategoryFormData) => {
    if (!addingSubCategory) return;

    try {
      // Convert array of size-price objects to record
      const kilo_to_price_map: Record<string, number> = {};
      formData.kilo_to_price_map.forEach((item) => {
        if (
          item.size.trim() &&
          typeof item.price === "number" &&
          item.price > 0
        ) {
          kilo_to_price_map[item.size] = item.price;
        }
      });

      // Ensure price and upfront_payment are numbers
      const price = typeof formData.price === "number" ? formData.price : 0;
      const upfront_payment =
        typeof formData.upfront_payment === "number"
          ? formData.upfront_payment
          : 0;

      const createSubCategoryDto: CreateSubCategoryDto = {
        category_id: addingSubCategory._id,
        name: formData.name.trim(),
        status: formData.status,
        upfront_payment,
        is_pieceable: formData.is_pieceable,
        price,
        ...(!formData.is_pieceable &&
          Object.keys(kilo_to_price_map).length > 0 && { kilo_to_price_map }),
      };

      await createSubCategory(createSubCategoryDto);

      // Refresh categories to get updated data with subcategories
      const refreshed = await getCategories();
      setCategories(refreshed);

      setAddingSubCategory(null);
      setIsSubCategoryModalOpen(false);
      toast.success("Sub-category created successfully!");
    } catch (err) {
      console.error("Error creating sub-category:", err);
      const message =
        err instanceof Error ? err.message : "Failed to create sub-category";
      setError(message);
      toast.error(message);
    }
  };

  // Edit sub-category
  const handleEditSubCategory = (category: Category, subCategoryId: string) => {
    const subCategory = category.subcategories?.find(
      (sub) => sub._id === subCategoryId
    );
    if (subCategory) {
      // Convert kilo_to_price_map object to array for the form
      const kilo_to_price_map = subCategory.kilo_to_price_map
        ? Object.entries(subCategory.kilo_to_price_map).map(
            ([size, price]) => ({
              size,
              price,
            })
          )
        : [{ size: "", price: "" as any }];

      setEditingSubCategory({
        category,
        subCategoryId,
        subCategoryData: {
          name: subCategory.name,
          status: subCategory.status,
          upfront_payment: subCategory.upfront_payment,
          price: subCategory.price,
          is_pieceable: subCategory.is_pieceable,
          kilo_to_price_map,
        },
      });
      setIsSubCategoryModalOpen(true);
    }
  };

  const handleUpdateSubCategory = async (formData: SubCategoryFormData) => {
    if (!editingSubCategory) return;

    try {
      // Convert array of size-price objects to record
      const kilo_to_price_map: Record<string, number> = {};
      formData.kilo_to_price_map.forEach((item) => {
        if (
          item.size.trim() &&
          typeof item.price === "number" &&
          item.price > 0
        ) {
          kilo_to_price_map[item.size] = item.price;
        }
      });

      // Ensure price and upfront_payment are numbers
      const price = typeof formData.price === "number" ? formData.price : 0;
      const upfront_payment =
        typeof formData.upfront_payment === "number"
          ? formData.upfront_payment
          : 0;

      const updateSubCategoryDto: UpdateSubCategoryDto = {
        name: formData.name.trim(),
        status: formData.status,
        upfront_payment,
        is_pieceable: formData.is_pieceable,
        price,
        ...(!formData.is_pieceable &&
          Object.keys(kilo_to_price_map).length > 0 && { kilo_to_price_map }),
      };

      await updateSubCategory(
        editingSubCategory.subCategoryId,
        updateSubCategoryDto
      );

      const refreshed = await getCategories();
      setCategories(refreshed);

      setEditingSubCategory(null);
      setIsSubCategoryModalOpen(false);
      toast.success("Sub-category updated successfully!");
    } catch (err) {
      console.error("Error updating sub-category:", err);
      const message =
        err instanceof Error ? err.message : "Failed to update sub-category";
      setError(message);
      toast.error(message);
    }
  };

  // Delete sub-category
  const handleDeleteSubCategory = async () => {
    if (!deleteSubCategoryModal) return;

    try {
      await deleteSubCategory(deleteSubCategoryModal.subCategoryId);

      const refreshed = await getCategories();
      setCategories(refreshed);

      setDeleteSubCategoryModal(null);
      toast.success("Sub-category deleted successfully!");
    } catch (err) {
      console.error("Error deleting sub-category:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete sub-category";
      setError(message);
      toast.error(message);
    }
  };

  const activeCategoryId =
    editingCategory?._id ||
    addingSubCategory?._id ||
    editingSubCategory?.category?._id;

  if (loading) {
    return <LoadingState message="Loading categories..." fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-2 pb-4 md:pb-8">
      <HeroSection
        title="Categories"
        subtitle="Track all categories in client page in one place"
        Icon={Layers}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mt-4 sm:mt-6 ">
        <section className="bg-card border-2 border-border rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 w-full border-b">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary">
                All Categories
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl mx-auto sm:mx-0">
                Manage your product categories and sub-categories efficiently.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
            >
              + Create New Category
            </Button>
          </div>

          <div className="p-3 sm:p-4 lg:p-6 bg-background-2">
            {/* Categories Grid */}
            <CategoriesGrid
              categories={categories}
              onEditCategory={handleEditCategory}
              onDeleteCategory={(category) => setDeleteCategoryModal(category)}
              onAddSubCategory={handleAddSubCategory}
              onEditSubCategory={handleEditSubCategory}
              onDeleteSubCategory={(category, subCategoryId) =>
                setDeleteSubCategoryModal({ category, subCategoryId })
              }
              activeCategoryId={activeCategoryId}
            />
          </div>
        </section>
      </main>

      {/* Category Modal (Create/Edit) */}
      <Dialog
        open={isCategoryModalOpen}
        onOpenChange={(open) => {
          setIsCategoryModalOpen(open);
          if (!open) setEditingCategory(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the name of your existing category."
                : "Add a new main category to your store catalog."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <CategoryForm
              key={editingCategory?._id || "new-category"}
              onSubmit={
                editingCategory ? handleUpdateCategory : handleAddCategory
              }
              placeholder="e.g. Cakes, Pastries, Drinks"
              buttonText={editingCategory ? "Update Category" : "Add Category"}
              initialValue={editingCategory?.name}
              onCancel={() => setIsCategoryModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-category Modal (Create/Edit) */}
      <Dialog
        open={isSubCategoryModalOpen}
        onOpenChange={(open) => {
          setIsSubCategoryModalOpen(open);
          if (!open) {
            setAddingSubCategory(null);
            setEditingSubCategory(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle>
              {editingSubCategory ? "Edit Sub-category" : "Add Sub-category"}
            </DialogTitle>
            <div className="mt-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="font-medium text-primary">
                      {addingSubCategory?.name ||
                        editingSubCategory?.category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {editingSubCategory
                        ? editingSubCategory.subCategoryData.name
                        : "New Sub-category"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </DialogHeader>

          {addingSubCategory && (
            <SubCategoryForm
              onSubmit={handleCreateSubCategory}
              onCancel={() => setIsSubCategoryModalOpen(false)}
              categoryName={addingSubCategory.name}
            />
          )}

          {editingSubCategory && (
            <SubCategoryForm
              onSubmit={handleUpdateSubCategory}
              onCancel={() => setIsSubCategoryModalOpen(false)}
              initialData={editingSubCategory.subCategoryData}
              categoryName={editingSubCategory.category.name}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Category Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteCategoryModal}
        title="Are you sure?"
        message="This action cannot be undone. This will permanently delete the category and all its sub-categories from your shop."
        confirmText="Delete Category"
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCategoryModal(null)}
      />

      {/* Delete Sub-category Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteSubCategoryModal}
        title="Are you sure?"
        message="This action cannot be undone. This will permanently delete the sub-category from your shop."
        confirmText="Delete Sub-category"
        onConfirm={handleDeleteSubCategory}
        onCancel={() => setDeleteSubCategoryModal(null)}
      />
    </div>
  );
}
