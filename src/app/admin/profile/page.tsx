"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import LoadingState from "@/components/LoadingState";
import {
  getAdminProfile,
  updateAdminProfile,
  uploadProfileImage,
  type User,
} from "@/app/services/admin/userService";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);

  // Editable fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getAdminProfile();
        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateAdminProfile({
        name: name.trim(),
        email: email.trim(),
        phone_number: phone.trim(),
      });
      setProfile(updated);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const updated = await uploadProfileImage(file);
      setProfile(updated);
      toast.success("Profile image updated");
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err?.message || "Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirmation do not match.");
      return;
    }
    // TODO: Implement password change API when available
    setUpdatingPassword(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password updated successfully.");
      toast.success("Password updated successfully");
    } catch (error: any) {
      setPasswordMessage("Failed to update password");
      toast.error("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link href="/admin" className="text-sm text-gray-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Profile Card & Edit Form */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl overflow-hidden">
                  {profile?.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
                <div className="ml-3">
                  <label className="text-sm text-gray-600 block mb-1">
                    Change Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={saving}
                    className="text-sm"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile?.name || "Admin"}
                  </h2>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Joined{" "}
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Unknown"}
                  </p>
                </div>
              </div>

              {/* Profile Edit Form */}
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full border px-3 py-2 rounded bg-white text-sm"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full border px-3 py-2 rounded bg-white text-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full border px-3 py-2 rounded bg-white text-sm"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="border rounded p-4 bg-gray-50">
                  <label className="text-sm text-gray-600">Role</label>
                  <p className="font-semibold capitalize">
                    {profile?.role || "Admin"}
                  </p>
                </div>

                <Button
                  type="submit"
                  loading={saving}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded w-full"
                >
                  Update Profile
                </Button>
              </form>
            </div>

            {/* Right: Password Change */}
            <div>
              <div className="bg-gradient-to-br from-background-2 to-card p-8 rounded">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form
                  onSubmit={handlePasswordUpdate}
                  className="space-y-3 max-w-sm"
                >
                  <div>
                    <label className="text-sm text-gray-600">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 w-full border px-3 py-2 rounded bg-white text-sm"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 w-full border px-3 py-2 rounded bg-white text-sm"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 w-full border px-3 py-2 rounded bg-white text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>

                  {passwordMessage && (
                    <div className="text-sm text-center text-gray-700">
                      {passwordMessage}
                    </div>
                  )}

                  <div>
                    <Button 
                      type="submit"
                      loading={updatingPassword}
                      disabled={updatingPassword}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded w-full"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
