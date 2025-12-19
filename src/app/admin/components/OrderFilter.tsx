import { OrderStatus, statusLabels } from "../../types/order";

interface OrderFiltersProps {
  filterStatus: OrderStatus | "All";
  onFilterStatusChange: (status: OrderStatus | "All") => void;
  search: string;
  onSearchChange: (search: string) => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  isFilterActive: boolean;
  onClearFilters: () => void;
  showMobileFilters: boolean;
  onShowMobileFiltersChange: (show: boolean) => void;
}

// Backend status values
const orderStatuses: OrderStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "completed",
];

export default function OrderFilters({
  filterStatus,
  onFilterStatusChange,
  search,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  itemsPerPage,
  onItemsPerPageChange,
  isFilterActive,
  onClearFilters,
  showMobileFilters,
  onShowMobileFiltersChange,
}: OrderFiltersProps) {
  return (
    <>
      {/* Mobile Filters toggle button */}
      <div className="sm:hidden mb-3 flex items-center gap-2">
        <button
          onClick={() => onShowMobileFiltersChange(!showMobileFilters)}
          aria-expanded={showMobileFilters}
          className="flex-1 px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
        >
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
        {isFilterActive && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2 bg-gray-500 text-white rounded-md text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className={`${showMobileFilters ? "block mb-4" : "hidden"} sm:block`}
      >
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => onFilterStatusChange(e.target.value as any)}
              className="border rounded-md px-3 py-2 w-full sm:w-52 text-sm"
            >
              <option value="All">All Statuses</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by customer name"
              className="border rounded-md px-3 py-2 w-full sm:w-64 text-sm"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              className="border rounded-md px-3 py-2 w-full sm:w-40 text-sm"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              className="border rounded-md px-3 py-2 w-full sm:w-40 text-sm"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto"></div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items per page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border rounded-md px-3 py-2 w-full sm:w-28 text-sm"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <div className="hidden sm:block">
              {isFilterActive && (
                <button
                  onClick={onClearFilters}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
