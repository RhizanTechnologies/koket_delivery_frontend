import { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";

interface ProductsGridProps {
  products: Product[];
  indexOfFirstProduct: number;
  onEdit: (id: string) => void;
  onDelete: (index: number, productId: string) => void;
}

export default function ProductsGrid({
  products,
  indexOfFirstProduct,
  onEdit,
  onDelete,
}: ProductsGridProps) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-50 rounded-full p-6 mb-4">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600 text-sm text-center max-w-md">
          There are no products matching your criteria. Try adjusting your
          filters or add a new product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
      {products.map((product, idx) => {
        const globalIndex = indexOfFirstProduct + idx;
        return (
          <div
            key={`${product._id}-${globalIndex}`}
            className="transform hover:-translate-y-2 transition-all duration-300"
          >
            <ProductCard
              product={product}
              onView={() => router.push(`/admin/products/${product._id}`)}
              onEdit={() => onEdit(product._id)}
              onDelete={() => onDelete(idx, product._id)}
            />
          </div>
        );
      })}
    </div>
  );
}
