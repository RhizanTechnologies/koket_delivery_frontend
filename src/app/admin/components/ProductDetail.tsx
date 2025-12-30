import Image from "next/image";
import { Product } from "../../types/order";

interface ProductDetailProps {
  product: Product;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ProductDetail({
  product,
  isExpanded,
  onToggle,
}: ProductDetailProps) {
  const truncateMessage = (message: string, maxLength: number) => {
    return message.length > maxLength
      ? message.slice(0, maxLength) + "..."
      : message;
  };

  return (
    <div className="border-b pb-6 last:border-b-0 bg-gray-200 rounded-2xl p-6">
      <div
        className="flex justify-between md:flex-row flex-col md:items-center gap-3 cursor-pointer"
        role="button"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
            <Image
              src={product.image || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover rounded-md"
              sizes="56px"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{product.name}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              Qty: {product.quantity} • Kilo: {product.kilo} kg
            </p>
            <p className="text-xs sm:text-sm line-clamp-1 text-gray-600 italic">
              {product.message
                ? `Message: ${truncateMessage(product.message, 40)}`
                : "—"}
            </p>
          </div>
        </div>
        <p className="font-semibold text-xs text-right">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 mt-5">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{product.name}</p>
              <p className="text-xs text-gray-500">
                Qty: {product.quantity} • {product.kilo} kg
              </p>
              {product.message && (
                <p className="text-xs italic text-gray-600 mt-1 break-words break-all whitespace-pre-wrap overflow-hidden">
                  Message: {product.message}
                </p>
              )}
              <div className="mt-2 text-right">
                <p className="font-medium">
                  ${(product.price * product.quantity).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
