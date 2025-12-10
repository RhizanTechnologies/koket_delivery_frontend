import {
  Order,
  OrderStatus,
  statusColors,
  statusLabels,
} from "../../types/order";
import ProductDetail from "./ProductDetail";
import {
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaExclamationTriangle,
} from "react-icons/fa";

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onReject: (id: string) => void;
  isProductExpanded: (orderId: string, productId: string) => boolean;
  onToggleProductDetail: (orderId: string, productId: string) => void;
}

export default function OrderCard({
  order,
  onStatusChange,
  onReject,
  isProductExpanded,
  onToggleProductDetail,
}: OrderCardProps) {
  const orderId = order._id || order.id || "";

  // Handle dropdown change - show reject modal if "rejected" is selected
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === "rejected") {
      onReject(orderId);
    } else {
      onStatusChange(orderId, newStatus);
    }
  };

  // Status badge styles
  const getStatusStyle = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      accepted: "bg-blue-100 text-blue-700 border-blue-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    "https://backend-om79.onrender.com";

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-5 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <FaBox className="text-pink-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                Order #{orderId.slice(-8)}
              </h2>
              <p className="text-xs text-gray-500">
                {order.date ||
                  new Date(order.created_at || "").toLocaleDateString()}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(
              order.status
            )}`}
          >
            {statusLabels[order.status] || order.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <FaUser className="text-pink-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-medium text-gray-800">
                {order.customer || order.user_details?.name || "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaPhone className="text-pink-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="font-medium text-gray-800">
                {order.contact || order.phone_number || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaCalendarAlt className="text-pink-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Delivery Date</p>
              <p className="font-medium text-gray-800">
                {order.deliveryDate ||
                  (order.delivery_time
                    ? new Date(order.delivery_time).toLocaleDateString()
                    : "Not specified")}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaBox className="text-gray-400" />
            Order Items (
            {order.order_items?.length || order.products?.length || 0})
          </h3>
          <div className="space-y-2">
            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800">
                        {item.product_details?.name ||
                          `Product ${item.product_id?.slice(-6) || index + 1}`}
                      </span>
                      <span className="text-gray-500 ml-2">
                        x{item.quantity}
                        {item.kilo ? ` (${item.kilo}kg)` : ""}
                        {item.pieces ? ` (${item.pieces} pcs)` : ""}
                      </span>
                    </div>
                    {item.product_details?.price && (
                      <span className="font-semibold text-pink-600">
                        ETB{" "}
                        {(item.product_details.price * item.quantity).toFixed(
                          2
                        )}
                      </span>
                    )}
                  </div>
                  {(item.custom_text || item.additional_description) && (
                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                      {item.custom_text && (
                        <p className="flex items-start gap-1">
                          <span className="font-medium">Message:</span>{" "}
                          <span className="italic">"{item.custom_text}"</span>
                        </p>
                      )}
                      {item.additional_description && (
                        <p className="mt-1">
                          <span className="font-medium">Note:</span>{" "}
                          {item.additional_description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : order.products && order.products.length > 0 ? (
              order.products.map((product) => (
                <ProductDetail
                  key={product.id}
                  product={product}
                  isExpanded={isProductExpanded(orderId, product.id)}
                  onToggle={() => onToggleProductDetail(orderId, product.id)}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                No items in this order
              </p>
            )}
          </div>
        </div>

        {/* Rejection Comment */}
        {order.rejection_comment && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">
                  Rejection Reason
                </p>
                <p className="text-sm text-red-600">
                  {order.rejection_comment}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer: Pricing + Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100">
          {/* Pricing */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-pink-50 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-500">Total Price</p>
              <p className="text-lg font-bold text-pink-600">
                ETB {order.total_price?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-500">Upfront Paid</p>
              <p className="text-lg font-bold text-green-600">
                ETB {order.upfront_paid?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Actions for Pending */}
            {order.status === "pending" && (
              <>
                <button
                  onClick={() => onStatusChange(orderId, "accepted")}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaCheckCircle />
                  Accept
                </button>
                <button
                  onClick={() => onReject(orderId)}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaTimesCircle />
                  Reject
                </button>
              </>
            )}

            {/* Status Dropdown */}
            <select
              value={order.status}
              onChange={handleDropdownChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-colors"
            >
              {(Object.keys(statusColors) as OrderStatus[]).map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>

            {/* Download Payment Proof */}
            {order.receiptUrl || order.payment_proof_url ? (
              <a
                href={`${IMAGE_BASE_URL}${
                  order.receiptUrl || order.payment_proof_url
                }`}
                download={`payment-proof-${orderId.slice(-8)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FaDownload />
                Receipt
              </a>
            ) : (
              <button
                disabled
                className="flex items-center gap-1.5 bg-gray-200 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                <FaDownload />
                No Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
