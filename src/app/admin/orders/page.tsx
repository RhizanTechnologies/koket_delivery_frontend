"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Order,
  OrderStatus,
  statusColors,
  statusLabels,
  mapOrderToDisplay,
} from "../../types/order";

import OrderCard from "../components/OrderCard";
import Pagination from "../components/Pagination";
import RejectModal from "../components/RejectModal";
import OrderFilters from "../components/OrderFilter";
import {
  getAllOrders,
  updateOrder,
  filterOrdersByStatus,
} from "../../services/admin/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [expandedProductKeys, setExpandedProductKeys] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Order[];
      if (filterStatus !== "All") {
        data = await filterOrdersByStatus(filterStatus);
      } else {
        data = await getAllOrders();
      }

      // Map orders to display format
      const mappedOrders = data.map(mapOrderToDisplay);
      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Extract unique categories from products (if products have category info)
  const categories = ["All"];

  const parseDate = (dateString: string) => {
    try {
      return new Date(dateString);
    } catch {
      return new Date();
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer?.toLowerCase().includes(search.toLowerCase()) ||
      order.phone_number?.toLowerCase().includes(search.toLowerCase()) ||
      order._id?.toLowerCase().includes(search.toLowerCase());

    const orderDate = parseDate(
      order.created_at || order.date || new Date().toISOString()
    );
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesFromDate = !from || orderDate >= from;
    const matchesToDate = !to || orderDate <= to;

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  // Only reset page when filter/search changes, NOT when orders are updated
  useEffect(() => {
    setCurrentPage(1);
  }, [search, fromDate, toDate, categoryFilter, itemsPerPage, filterStatus]);

  // Sort orders: pending first, then accepted, then by most recent date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Priority order: pending > accepted > completed > rejected
    const statusPriority: Record<OrderStatus, number> = {
      pending: 0,
      accepted: 1,
      completed: 2,
      rejected: 3,
    };

    const priorityA = statusPriority[a.status] ?? 4;
    const priorityB = statusPriority[b.status] ?? 4;

    // First sort by status priority
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Then sort by date (most recent first)
    const dateA = new Date(a.created_at || a.date || 0).getTime();
    const dateB = new Date(b.created_at || b.date || 0).getTime();
    return dateB - dateA;
  });

  const totalItems = sortedOrders.length;
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      setUpdating(id);
      await updateOrder(id, { status });

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err: any) {
      console.error("Error updating order status:", err);
      setError(err.message || "Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = (id: string) => {
    setSelectedOrder(id);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (selectedOrder) {
      try {
        setUpdating(selectedOrder);
        await updateOrder(selectedOrder, {
          status: "rejected",
          rejection_comment: rejectReason,
        });

        // Update local state
        setOrders((prev) =>
          prev.map((o) =>
            o._id === selectedOrder
              ? { ...o, status: "rejected", rejection_comment: rejectReason }
              : o
          )
        );
      } catch (err: any) {
        console.error("Error rejecting order:", err);
        setError(err.message || "Failed to reject order");
      } finally {
        setUpdating(null);
      }
    }
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedOrder(null);
    setExpandedProductKeys((prev) =>
      prev.filter((k) => !k.startsWith(`${selectedOrder}-`))
    );
  };

  const clearFilters = () => {
    setFilterStatus("All");
    setSearch("");
    setFromDate("");
    setToDate("");
    setCategoryFilter("All");
    setItemsPerPage(5);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const isFilterActive =
    filterStatus !== "All" ||
    search !== "" ||
    fromDate !== "" ||
    toDate !== "" ||
    categoryFilter !== "All";

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const toggleProductDetail = (orderId: string, productId: string) => {
    const key = `${orderId}-${productId}`;
    setExpandedProductKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isProductExpanded = (orderId: string, productId: string) =>
    expandedProductKeys.includes(`${orderId}-${productId}`);

  return (
    <div className="">
      <div className="bg-background-2 section-spacing text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center mb-4 gap-2">
          <img
            src="../../../../assets/cake.png"
            alt="cake png"
            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md mb-3"
          />
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-kaushan italic mb-3 text-foreground pl-0 sm:pl-2">
            Orders
          </h1>
        </div>
        <p className="text-muted-foreground text-base sm:text-2xl max-w-3xl mx-auto text-balance -mt-8 md:-mt-4">
          Manage all customer orders
        </p>
      </div>

      <div className="border-2 m-4 sm:m-6 rounded-3xl">
        <div className="overview px-3 sm:px-6 lg:px-10 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">All Orders</h1>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="text-sm px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-md disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchOrders();
                }}
                className="text-sm underline mt-1"
              >
                Try again
              </button>
            </div>
          )}

          <OrderFilters
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            search={search}
            onSearchChange={setSearch}
            fromDate={fromDate}
            onFromDateChange={setFromDate}
            toDate={toDate}
            onToDateChange={setToDate}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            categories={categories}
            isFilterActive={isFilterActive}
            onClearFilters={clearFilters}
            showMobileFilters={showMobileFilters}
            onShowMobileFiltersChange={setShowMobileFilters}
          />

          {/* Orders List */}
          <div className="space-y-6 mt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <div key={order._id} className="relative">
                  {updating === order._id && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                  )}
                  <OrderCard
                    order={order}
                    onStatusChange={handleStatusChange}
                    onReject={handleReject}
                    isProductExpanded={isProductExpanded}
                    onToggleProductDetail={toggleProductDetail}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-10">
                No orders found.
              </p>
            )}
          </div>

          {/* Universal Pagination Component */}
          {!loading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              className="mt-6"
            />
          )}

          <RejectModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            onConfirm={confirmReject}
            rejectReason={rejectReason}
            onRejectReasonChange={setRejectReason}
          />
        </div>
      </div>
    </div>
  );
}
