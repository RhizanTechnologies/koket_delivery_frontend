import { Customer } from "../../types/customer";
import CustomerCard from "./CustomerCard";

interface CustomersListProps {
  customers: Customer[];
  onDelete: (customer: Customer) => void;
  currentUserId?: string;
}

export default function CustomersList({
  customers,
  onDelete,
  currentUserId,
}: CustomersListProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No customers found matching your search.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onDelete={onDelete}
          isCurrentUser={String(customer.id) === currentUserId}
        />
      ))}
    </div>
  );
}
