import { Category } from "../../types/category";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSubCategory: (category: Category) => void;
  onEditSubCategory: (category: Category, subCategoryId: string) => void;
  onDeleteSubCategory: (category: Category, subCategoryId: string) => void;
  isActive?: boolean;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onAddSubCategory,
  onEditSubCategory,
  onDeleteSubCategory,
}: CategoryCardProps) {
  return (
    <div className="border rounded-lg p-3 sm:p-4 md:p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Category Header */}
      {/* Category Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          {/* Category Name + Info */}
          <div className="flex-1  w-[100%]">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
              {category.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {category.subcategories?.length || 0} sub-categor
              {(category.subcategories?.length || 0) === 1 ? "y" : "ies"}
            </p>
          </div>

          {/* Action Buttons - Unified Responsive Layout */}
          <div className="flex flex-wrap gap-2 md:flex-nowrap md:ml-4 ">
            <Button
              onClick={() => onAddSubCategory(category)}
              className="bg-emerald-400 hover:bg-emerald-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 flex-1 sm:flex-none min-w-[56px] sm:min-w-[90px]"
            >
              + Sub
            </Button>
            <Button
              onClick={() => onEdit(category)}
              className="bg-blue-400 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-2 flex-1 sm:flex-none min-w-[70px] sm:min-w-[80px]"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(category)}
              className="bg-red-400 hover:bg-red-700 text-white text-xs sm:text-sm px-3 py-2 flex-1 sm:flex-none min-w-[70px] sm:min-w-[80px]"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Sub-categories List */}
      {category.subcategories && category.subcategories.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Sub-categories:
          </h4>
          <div className="max-h-48 overflow-y-auto pr-1 sm:pr-2">
            {category.subcategories.map((subCategory) => (
              <div
                key={subCategory._id}
                className="flex flex-col xs:flex-row xs:justify-between xs:items-start sm:items-center gap-2 py-2 px-3 bg-gray-50 rounded-md mb-2 last:mb-0"
              >
                {/* Sub-category Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-800 break-words block">
                    {subCategory.name}
                  </span>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        subCategory.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {subCategory.status}
                    </span>
                    {subCategory.is_pieceable && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Pieces
                      </span>
                    )}
                    {/* Price Info */}

                    {(subCategory.price ?? 0) > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        ${subCategory.price ?? 0}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 sm:gap-2 self-end xs:self-auto flex-shrink-0">
                  <button
                    onClick={() => onEditSubCategory(category, subCategory._id)}
                    className="text-primary hover:text-primary/80 text-xs px-2 py-1 border border-primary/30 rounded hover:bg-primary/10 transition-colors min-w-[45px] sm:min-w-[50px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onDeleteSubCategory(category, subCategory._id)
                    }
                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors min-w-[45px] sm:min-w-[50px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-xs sm:text-sm bg-gray-50 rounded-md">
          No sub-categories added yet
        </div>
      )}
    </div>
  );
}
