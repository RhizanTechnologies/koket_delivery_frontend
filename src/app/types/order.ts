// Backend order status types
export type OrderStatus = "pending" | "accepted" | "rejected" | "completed";

// Legacy status for UI compatibility (can be removed later)
export type LegacyOrderStatus =
  | "Pending"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Canceled";

// Order item from backend
export type OrderItem = {
  product_id?: string;
  kilo?: number;
  pieces?: number;
  quantity: number;
  custom_text?: string;
  additional_description?: string;
};

// Product details (populated from product_id)
export type ProductDetail = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

// Combined order item with product details for display
export type OrderItemWithDetails = OrderItem & {
  product?: ProductDetail;
};

// Legacy Product type for backward compatibility
export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  kilo: number;
  message?: string;
};

// Backend order type
export type Order = {
  _id?: string;
  id?: string; // Alias for _id
  order_items?: OrderItemWithDetails[];
  phone_number?: string;
  total_price?: number;
  upfront_paid?: number;
  payment_proof_url?: string;
  delivery_time?: string;
  status: OrderStatus;
  rejection_comment?: string;
  created_at?: string;
  updated_at?: string;
  // Populated fields
  user_id?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  // Legacy fields for backward compatibility with UI
  customer?: string;
  date?: string;
  deliveryDate?: string;
  deliveryLocation?: string;
  contact?: string;
  receiptUrl?: string;
  products?: Product[];
};

// Status colors for backend status values
export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};

// Status labels for display
export const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};

// Legacy status colors for backward compatibility
export const legacyStatusColors: Record<LegacyOrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  "In Progress": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Canceled: "bg-red-100 text-red-700",
};

// Helper to convert backend order to display format
export const mapOrderToDisplay = (order: Order): Order => {
  return {
    ...order,
    id: order._id,
    customer: order.user_id?.name || "Unknown Customer",
    date: order.created_at
      ? new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined,
    deliveryDate: order.delivery_time
      ? new Date(order.delivery_time).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : undefined,
    contact: order.phone_number,
    receiptUrl: order.payment_proof_url,
  };
};
