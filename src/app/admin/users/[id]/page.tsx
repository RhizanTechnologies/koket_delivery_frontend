"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { Customer } from "../../../types/customer";
import { getUserById, deleteUser } from "../../../services/admin/userService";
import { useAuth } from "../../../context/AuthContext";
import UserDetailLayout from "../../components/UserDetailLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserNotFound from "../../components/UserNotFound";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = params.id as string;
      const userData = await getUserById(userId);

      // Map to Customer type
      const customer: Customer = {
        id: userData._id || userData.id || userId,
        _id: userData._id,
        name: userData.name || "Unknown",
        email: userData.email || "",
        phone: userData.phone || "",
        joined: userData.created_at
          ? new Date(userData.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Unknown",
        totalOrders: 0,
        totalSpent: 0,
        role: userData.role,
      };

      setUser(customer);
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id, fetchUser]);

  const handleDelete = async () => {
    if (!user) return;

    try {
      setDeleting(true);
      await deleteUser(String(user.id));
      router.push("/admin/users");
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(err.message || "Failed to delete user");
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading user details..." />;
  }

  if (error || !user) {
    return <UserNotFound />;
  }

  return (
    <UserDetailLayout
      user={user}
      onDelete={handleDelete}
      isCurrentUser={String(user.id) === currentUser?.id}
    />
  );
}
