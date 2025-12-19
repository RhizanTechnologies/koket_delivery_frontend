"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { UserProfileCard } from "./components/UserProfileCard";
import { UserStats } from "./components/UserStats";
import { MyReviewsSection } from "./components/MyReviewsSection";
import { EditProfileModal } from "./components/EditProfileModal";
import { DeleteAccountDialog } from "./components/DeleteAccountDialog";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import LoadingState from "@/components/LoadingState";
import {
  getProfile,
  User,
  UserStatsData,
  UserRating,
} from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { profileUpdateSchema } from "../schemas";
import { validateSafe } from "../utils/validation";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone_number: "",
    joinedDate: "",
    initials: "",
    profileImage: "",
  });
  const [stats, setStats] = useState<UserStatsData>({
    totalOrders: 0,
    totalSpending: 0,
    recentRatings: [],
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getProfile();

      setUser({
        name: profileData.name || "Unknown",
        email: profileData.email || "",
        phone_number: profileData.phone_number || "Not set",
        joinedDate: profileData.created_at
          ? new Date(profileData.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Unknown",
        initials: getInitials(profileData.name || "U"),
        profileImage: profileData.profile_image || "",
      });

      // Set stats from API
      if (profileData.stats) {
        setStats({
          totalOrders: profileData.stats.totalOrders || 0,
          totalSpending: profileData.stats.totalSpending || 0,
          recentRatings: profileData.stats.recentRatings || [],
        });
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isLoggedIn) {
      router.replace("/auth/login");
      return;
    }

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [authLoading, isLoggedIn, router, fetchProfile]);

  // Transform API reviews to component format
  const reviews = stats.recentRatings.map((rating: UserRating) => ({
    product: {
      _id: rating.product._id,
      name: rating.product.name,
    },
    rating: rating.rating,
    comment: rating.comment,
    created_at: rating.created_at,
  }));

  const handleSaveProfile = async (data: {
    fullName: string;
    email: string;
    phone_number: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input data with Zod
      const validation = validateSafe(profileUpdateSchema, {
        name: data.fullName,
        email: data.email,
        phone_number: data.phone_number,
      });

      if (!validation.success) {
        setError(validation.error);
        toast.error(validation.error);
        setLoading(false);
        return;
      }

      // Import the update function
      const { updateUserProfile } = await import("../services/profileService");

      // Call API to update profile
      await updateUserProfile(validation.data);

      // Update local state
      setUser({
        ...user,
        name: data.fullName,
        email: data.email,
        phone_number: data.phone_number,
        initials: getInitials(data.fullName),
      });

      // Show success message
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    setDeleteDialogOpen(false);
    logout();
    router.push("/");
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const { changePassword } = await import("../services/profileService");

      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully!");
      setChangePasswordModalOpen(false);
    } catch (err: any) {
      console.error("Error changing password:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to change password";
      toast.error(errorMessage);
      throw err; // Re-throw to keep modal open
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Show loading while fetching profile
  if (loading) {
    return <LoadingState message="Loading profile..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background-2 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProfile} className="px-4 py-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-2">
      <div className="py-6 sm:py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors font-medium group"
          >
            <div className="w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary transition-all">
              <ChevronLeft className="h-4 w-4" />
            </div>
            Back to Home
          </Link>

          {/* Page Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your account, view your orders, and track your activity
            </p>
          </div>

          {/* Profile Card */}
          <div className="mb-8">
            <UserProfileCard
              user={user}
              stats={stats}
              onEdit={() => setEditModalOpen(true)}
              onDelete={() => setDeleteDialogOpen(true)}
              onChangePassword={() => setChangePasswordModalOpen(true)}
            />
          </div>

          {/* Reviews Section */}
          <MyReviewsSection reviews={reviews} />

          {/* Modals */}
          <EditProfileModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            user={{
              fullName: user.name,
              email: user.email,
              phone_number: user.phone_number,
            }}
            onSave={handleSaveProfile}
          />

          <ChangePasswordModal
            isOpen={changePasswordModalOpen}
            onClose={() => setChangePasswordModalOpen(false)}
            onSubmit={handleChangePassword}
          />

          <DeleteAccountDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
}
