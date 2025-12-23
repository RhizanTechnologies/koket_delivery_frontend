interface CheckoutItemPreviewProps {
  image: string;
  name: string;
  quantity: number;
  price: number;
}

export function CheckoutItemPreview({
  image,
  name,
  quantity,
  price,
}: CheckoutItemPreviewProps) {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <img
            src={image || "/assets/placeholder-product.jpg"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-pink-500">${price}</p>
        </div>
      </div>
    </div>
  );
}
