import { Customer } from "../../types/customer";

interface CustomerCardProps {
  customer: Customer;
  onDelete: (customer: Customer) => void;
}

export default function CustomerCard({
  customer,
  onDelete,
}: CustomerCardProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <a
        href={`/admin/users/${customer.id}`}
        className="flex items-start gap-3 flex-1 min-w-0"
        aria-label={`View user ${customer.name}`}
      >
        <div className="h-12 w-12 rounded-full bg-gray-200 xss:flex items-center justify-center hidden flex-shrink-0">
          <span className="text-gray-500 text-xl">👤</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base sm:text-lg hover:text-pink-600 transition-colors truncate">
            {customer.name}
          </p>

          <p className="text-[12px] sm:text-sm md:text-base text-gray-500 truncate overflow-hidden">
            {customer.email}
          </p>
          <p className="text-sm md:text-base text-gray-500 truncate overflow-hidden">
            🗓 Joined {customer.joined}
          </p>
        </div>
      </a>

      <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-2">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 pb-2">Total Orders</p>
            <p className="bg-purple-100 px-3 py-1 rounded-md font-medium text-sm">
              {customer.totalOrders}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 pb-2">Total Spent</p>
            <p className="bg-purple-100 px-3 py-1 rounded-md font-medium text-purple-600 text-sm">
              ${customer.totalSpent.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(customer);
          }}
          className="text-red-600 border border-red-500 hover:bg-red-100 px-4 py-2 mt-4 rounded-md text-sm w-full sm:w-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
