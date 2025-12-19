import { useState } from "react";
import { UserCircle } from "lucide-react";
import { Customer } from "../../types/customer";
import HeroSection from "./HeroSection";
import UserProfileHeader from "./UserProfileHeader";
import StatsCards from "./StatsCards";
import UserInformation from "./UserInformation";
import RecentActivity from "./RecentActivity";
import ConfirmationModal from "./ConfirmationModal";

interface UserDetailLayoutProps {
  user: Customer;
  onDelete: () => void;
}

export default function UserDetailLayout({
  user,
  onDelete,
}: UserDetailLayoutProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="bg-background-2">
      <HeroSection
        title="User Details"
        subtitle={`Detailed information about ${user.name}`}
        Icon={UserCircle}
      />

      <div className="min-h-screen flex justify-center items-start py-6 w-full px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full shadow-lg border border-gray-200">
            <UserProfileHeader
              user={user}
              onDelete={() => setShowDeleteModal(true)}
            />
            <StatsCards user={user} />
            <UserInformation user={user} />
            <RecentActivity />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone and will permanently remove the user from your system.`}
        confirmText="Delete User"
        onConfirm={onDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
