import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SubCategoryFormProps {
  onSubmit: (data: SubCategoryFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SubCategoryFormData>;
  categoryName: string;
  isEditing?: boolean;
}

export interface SubCategoryFormData {
  name: string;
  status: "available" | "coming_soon";
  upfront_payment: number | "";
  price: number | "";
  is_pieceable: boolean;
  kilo_to_price_map: Array<{ size: string; price: number | "" }>;
}

export default function SubCategoryForm({
  onSubmit,
  onCancel,
  initialData,
  categoryName,
  isEditing = false,
}: SubCategoryFormProps) {
  const [formData, setFormData] = useState<SubCategoryFormData>({
    name: initialData?.name || "",
    status: initialData?.status || "available",
    upfront_payment: initialData?.upfront_payment ?? "",
    price: initialData?.price ?? "",
    is_pieceable: initialData?.is_pieceable || false,
    kilo_to_price_map: initialData?.kilo_to_price_map || [
      { size: "", price: "" as any },
    ],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      typeof formData.upfront_payment === "number" &&
      formData.upfront_payment < 0
    ) {
      newErrors.upfront_payment = "Upfront payment cannot be negative";
    }

    if (typeof formData.price === "number" && formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    // Validate kilo_to_price_map if not pieceable
    if (!formData.is_pieceable) {
      const validSizes = formData.kilo_to_price_map.filter(
        (item) =>
          item.size.trim() && typeof item.price === "number" && item.price > 0
      );
      if (validSizes.length === 0) {
        newErrors.kilo_to_price_map =
          "At least one valid size and price is required for kilo-based products";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Filter out empty sizes
    const filteredKiloMap = formData.kilo_to_price_map.filter(
      (item) =>
        item.size.trim() && typeof item.price === "number" && item.price > 0
    );

    // Convert empty strings to 0 before submitting
    onSubmit({
      ...formData,
      price: typeof formData.price === "number" ? formData.price : 0,
      upfront_payment:
        typeof formData.upfront_payment === "number"
          ? formData.upfront_payment
          : 0,
      kilo_to_price_map: filteredKiloMap.length > 0 ? filteredKiloMap : [],
    });
  };

  const addSizePriceField = () => {
    setFormData((prev) => ({
      ...prev,
      kilo_to_price_map: [
        ...prev.kilo_to_price_map,
        { size: "", price: "" as any },
      ],
    }));
  };

  const removeSizePriceField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      kilo_to_price_map: prev.kilo_to_price_map.filter((_, i) => i !== index),
    }));
  };

  const updateSizePriceField = (
    index: number,
    field: "size" | "price",
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      kilo_to_price_map: prev.kilo_to_price_map.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          {isEditing ? "Edit" : "Add"} Sub-category for{" "}
          <span className="text-primary">{categoryName}</span>
        </h3>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="Enter sub-category name"
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as "available" | "coming_soon",
              }))
            }
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
      </div>

      {/* Pricing Type */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_pieceable}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_pieceable: e.target.checked,
              }))
            }
            className="rounded border-border text-primary focus:ring-primary/40"
          />
          <span className="text-sm font-medium text-gray-700">
            Sold by pieces (instead of weight)
          </span>
        </label>
      </div>

      {/* Pricing Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Price (ETB) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price === "" ? "" : formData.price}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                price: value === "" ? "" : parseFloat(value) || "",
              }));
              if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
            }}
            placeholder="0.00"
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upfront Payment (ETB) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={
              formData.upfront_payment === "" ? "" : formData.upfront_payment
            }
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                upfront_payment: value === "" ? "" : parseFloat(value) || "",
              }));
              if (errors.upfront_payment)
                setErrors((prev) => ({ ...prev, upfront_payment: "" }));
            }}
            placeholder="0.00"
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
          />
          {errors.upfront_payment && (
            <p className="text-red-500 text-xs mt-1">
              {errors.upfront_payment}
            </p>
          )}
        </div>
      </div>

      {/* Size-based Pricing (only show if not pieceable) */}
      {!formData.is_pieceable && (
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Size-based Pricing *
            </label>
            <button
              type="button"
              onClick={addSizePriceField}
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md w-full sm:w-auto"
            >
              + Add Size
            </button>
          </div>

          {formData.kilo_to_price_map.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 items-start"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={item.size}
                  onChange={(e) =>
                    updateSizePriceField(index, "size", e.target.value)
                  }
                  placeholder="e.g., 0.5kg, 1kg, 2kg"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                />
              </div>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price === "" ? "" : item.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSizePriceField(
                      index,
                      "price",
                      value === "" ? "" : parseFloat(value) || ""
                    );
                  }}
                  placeholder="0.00"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                />
              </div>
              {formData.kilo_to_price_map.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSizePriceField(index)}
                  className="text-red-600 hover:text-red-800 px-2 py-2 w-full sm:w-auto"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {errors.kilo_to_price_map && (
            <p className="text-red-500 text-xs mt-1">
              {errors.kilo_to_price_map}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Add different sizes and their corresponding prices (e.g., 0.5kg:
            300, 1kg: 550)
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="px-4 sm:px-6 py-2 text-sm flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="px-4 sm:px-6 py-2 text-sm flex-1">
          {isEditing ? "Update" : "Add"} Sub-category
        </Button>
      </div>
    </form>
  );
}
