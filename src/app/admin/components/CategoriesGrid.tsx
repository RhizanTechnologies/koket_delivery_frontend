import { Category } from "../../types/category";
import CategoryCard from "./CategoryCard";

interface CategoriesGridProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddSubCategory: (category: Category) => void;
  onEditSubCategory: (category: Category, subCategoryId: string) => void;
  onDeleteSubCategory: (category: Category, subCategoryId: string) => void;
  activeCategoryId?: string | null;
}

export default function CategoriesGrid({
  categories,
  onEditCategory,
  onDeleteCategory,
  onAddSubCategory,
  onEditSubCategory,
  onDeleteSubCategory,
  activeCategoryId,
}: CategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-lg mb-2">No categories added</p>
        <p className="text-sm">Start by adding your first category above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6 xl:gap-8">
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
          onAddSubCategory={onAddSubCategory}
          onEditSubCategory={onEditSubCategory}
          onDeleteSubCategory={onDeleteSubCategory}
          isActive={category._id === activeCategoryId}
        />
      ))}
    </div>
  );
}
