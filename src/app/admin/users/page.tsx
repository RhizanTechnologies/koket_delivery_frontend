"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import { Customer } from "../../types/customer";
import HeroSection from "../components/HeroSection";
import CustomerFilters from "../components/CustomerFilters";
import CustomersList from "../components/CustomersList";
import Pagination from "../components/Pagination";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingState from "@/components/LoadingState";
import { getAllCustomers, deleteUser } from "../../services/admin/userService";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [deleting, setDeleting] = useState(false);

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCustomers();

      // Map API response to Customer type
      const mappedCustomers: Customer[] = data.map(
        (customer: any, index: number) => ({
          id: customer._id || customer.id || index + 1,
          name: customer.name || "Unknown",
          email: customer.email || "",
          phone: customer.phone || "",
          joined: customer.created_at
            ? new Date(customer.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown",
          totalOrders: customer.totalOrders || 0,
          totalSpent: customer.totalSpent || 0,
        })
      );

      setCustomers(mappedCustomers);
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      String(customer.id).includes(search)
  );

  const totalItems = filteredCustomers.length;
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async (id: number | string) => {
    try {
      setDeleting(true);
      await deleteUser(String(id));
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      setSelectedCustomer(null);
    } catch (err: any) {
      console.error("Error deleting customer:", err);
      setError(err.message || "Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteConfirm = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const cancelDelete = () => {
    setSelectedCustomer(null);
  };

  const confirmDelete = () => {
    if (selectedCustomer) {
      handleDelete(selectedCustomer.id);
    }
  };

  const clearFilters = () => {
    setSearch("");
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Header */}
      <HeroSection
        title="Customer"
        subtitle="Track customer details, orders, and updates all in one place"
        Icon={Users}
      />

      {/* Main content */}
      <div className="min-h-screen flex justify-center items-start py-6 w-full px-4 bg-background-2">
        <div className="w-full max-w-5xl mx-auto border border-black rounded-2xl">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Customer Management
                </h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  View and Manage all registered customers
                </p>
              </div>
              <button
                onClick={fetchCustomers}
                disabled={loading}
                className="text-sm px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md disabled:opacity-50"
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
                    fetchCustomers();
                  }}
                  className="text-sm underline mt-1"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Search Filters */}
            <CustomerFilters
              search={search}
              onSearchChange={setSearch}
              onClearFilters={clearFilters}
            />
            {/* Customers List */}
            {loading ? (
              <LoadingState message="Loading customers..." fullScreen={false} />
            ) : currentCustomers.length > 0 ? (
              <CustomersList
                customers={currentCustomers}
                onDelete={openDeleteConfirm}
              />
            ) : (
              <div className="text-center py-10 text-gray-500">
                {search
                  ? "No customers found matching your search."
                  : "No customers found."}
              </div>
            )}

            {/* Universal Pagination */}
            {!loading && totalItems > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
                className="mt-6"
              />
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!selectedCustomer}
          title="Are you sure?"
          message="This action cannot be undone. This will permanently delete the user from your shop."
          confirmText={deleting ? "Deleting..." : "Delete"}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
}
