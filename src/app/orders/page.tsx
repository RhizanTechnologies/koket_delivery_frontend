"use client";
import React, { useEffect, useState, useMemo } from "react";
import { getUserOrders, type Order } from "../services/orderService";
import LoadingState from "@/components/LoadingState";
import { PageHeader } from "@/components";
import { ChevronLeft, Package, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5001";

const resolveImageUrl = (path?: string) => {
  if (!path) return "/assets/placeholder-product.jpg";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_BASE_URL}${path}`;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  accepted: "bg-blue-100 text-blue-800 border-blue-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  completed: "bg-green-100 text-green-800 border-green-300",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserOrders();
      // Sort by newest first (created_at descending)
      const sortedOrders = data.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load orders";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on status
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  if (isLoading) {
    return <LoadingState message="Loading your orders..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md p-6 text-center">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-2">
        <div>
          <div className="mb-6 sm:mb-8 md:mb-12">
            <PageHeader
              title="My Orders"
              subtitle="Track and manage all your bakery orders in one place"
            />
          </div>

          <div className="section-spacing-x pb-8">
            {orders.length === 0 ? (
              <div className="flex items-center justify-center min-h-[500px] py-12 sm:py-16">
                <div className="max-w-md w-full text-center">
                  {/* Icon */}
                  <div className="mb-6 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                    You haven't placed any orders yet. Start browsing our
                    delicious products and place your first order!
                  </p>

                  {/* CTA Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => (window.location.href = "/products")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Browse Products
                    </Button>
                  </div>

                  {/* Decorative Element */}
                  <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="w-8 h-px bg-border"></div>
                    <span className="text-xs">Start Your Journey</span>
                    <div className="w-8 h-px bg-border"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Filter Section */}
                <div className="mb-6 sm:mb-8 bg-card border-2 border-border rounded-xl p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Filter className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          Filter Orders:
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-3 py-1.5 rounded-full font-bold border border-primary/30">
                        {filteredOrders.length}{" "}
                        {filteredOrders.length === 1 ? "Order" : "Orders"}
                      </span>
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[220px] h-11 border-2">
                        <SelectValue placeholder="All Orders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            All Orders
                          </div>
                        </SelectItem>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="accepted">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            Accepted
                          </div>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            Rejected
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            Completed
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[400px] py-12">
                    <div className="max-w-md w-full text-center">
                      {/* Icon */}
                      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
                        <svg
                          className="w-10 h-10 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>

                      {/* Text */}
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        No Orders Found
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        No orders match the selected status filter. Try
                        adjusting your filter or view all orders.
                      </p>

                      {/* CTA Button */}
                      <Button
                        variant="outline"
                        className="border-2 border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-full transition-all"
                        onClick={() => setStatusFilter("all")}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Clear Filter
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredOrders.map((order) => (
                      <Card
                        key={order._id}
                        className="p-6 sm:p-8 border-2 hover:border-primary/30 transition-all hover:shadow-lg"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-start gap-4 sm:gap-6 mb-6 pb-6 border-b-2 border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Order ID
                              </p>
                              <p className="text-sm font-bold font-mono text-foreground">
                                #{order._id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Delivery Date
                              </p>
                              <p className="text-sm font-bold text-foreground">
                                {new Date(
                                  order.delivery_time
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Status
                              </p>
                              <span
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 capitalize shadow-sm ${
                                  statusColors[order.status] ||
                                  statusColors.pending
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    order.status === "pending"
                                      ? "bg-yellow-600"
                                      : order.status === "accepted"
                                      ? "bg-blue-600"
                                      : order.status === "rejected"
                                      ? "bg-red-600"
                                      : "bg-green-600"
                                  }`}
                                ></span>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rejection Comment */}
                        {order.status === "rejected" &&
                          order.rejection_comment && (
                            <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-red-900 dark:text-red-100 mb-1">
                                    Rejection Reason
                                  </p>
                                  <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                                    {order.rejection_comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            Order Items ({order.order_items.length})
                          </h4>
                          <div className="space-y-4">
                            {order.order_items.map((item) => (
                              <div
                                key={item._id}
                                className="p-3 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-all"
                              >
                                {/* Image, Name, and Badges Row */}
                                <div className="flex gap-3 lg:gap-4">
                                  {/* Image */}
                                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-20 lg:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-border">
                                    <Image
                                      src={resolveImageUrl(
                                        item.product?.images?.[0] ||
                                          item.product?.image_url
                                      ) || "/placeholder-product.jpg"}
                                      alt={item.product?.name || "Product"}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  {/* Details */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground mb-1 truncate">
                                      {item.product?.name || "Product"}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                      <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                          />
                                        </svg>
                                        Qty: {item.quantity}
                                      </span>
                                      {item.kilo && (
                                        <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
                                          <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                            />
                                          </svg>
                                          {item.kilo}kg
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Custom Text - Full Width Below on Small Screens */}
                                {item.custom_text && (
                                  <div className="mt-3 lg:mt-0 lg:ml-[92px] xl:ml-[92px]">
                                    <p className="text-xs sm:text-sm text-primary font-medium bg-primary/10 px-3 py-2 rounded-md border border-primary/30 italic">
                                      💬 "{item.custom_text}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t-2 border-border pt-5">
                          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            Payment Summary
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                              <span className="text-sm font-medium text-muted-foreground">
                                Total Price
                              </span>
                              <span className="text-base font-bold text-foreground">
                                ETB {order.total_price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                              <span className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Upfront Paid (30%)
                              </span>
                              <span className="text-base font-bold text-green-700 dark:text-green-400">
                                ETB {order.upfront_paid.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/30">
                              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-primary"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                  />
                                </svg>
                                Remaining Balance
                              </span>
                              <span className="text-base font-bold text-primary">
                                ETB{" "}
                                {(
                                  order.total_price - order.upfront_paid
                                ).toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                              Pay remaining balance upon delivery
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
