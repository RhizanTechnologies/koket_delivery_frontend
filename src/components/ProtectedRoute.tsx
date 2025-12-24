"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import LoadingState from "@/components/LoadingState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyAdminRole } from "@/app/services/authService";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
  const [verifyingAdmin, setVerifyingAdmin] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    // Only redirect after loading is complete and user is not logged in
    if (!isLoading && !isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isLoading, isLoggedIn, router]);

  // Verify admin role with backend when requireAdmin is true
  useEffect(() => {
    const verifyAdmin = async () => {
      // Skip if not admin route or already verified or currently verifying
      if (!requireAdmin || !isLoggedIn || hasVerified || verifyingAdmin) return;

      console.log("🔍 Starting admin verification...");
      setVerifyingAdmin(true);

      try {
        const result = await verifyAdminRole();
        console.log("🔒 Admin verification result:", result);

        if (!result.isAdmin) {
          // Backend says user is NOT admin - force logout
          console.log("❌ Not admin - logging out");
          logout();
          router.replace("/");
        } else {
          console.log("✅ Admin verified");
          setAdminVerified(true);
        }
      } catch (error) {
        console.error("❌ Admin verification error:", error);
        // On error, deny access for security
        logout();
        router.replace("/");
      } finally {
        setVerifyingAdmin(false);
        setHasVerified(true);
      }
    };

    verifyAdmin();
  }, [requireAdmin, isLoggedIn, hasVerified, verifyingAdmin, logout, router]);

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingState message="Checking authentication…" fullScreen />;
  }

  // User not logged in - show loading while redirect happens
  if (!isLoggedIn) {
    return <LoadingState message="Redirecting to login…" fullScreen />;
  }

  // Show loading while verifying admin role with backend
  if (requireAdmin && verifyingAdmin) {
    return <LoadingState message="Verifying admin access…" fullScreen />;
  }

  // Client-side check (backup - main security is backend verification above)
  if (requireAdmin && user?.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background-2 px-4">
        <Card className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Access Restricted
          </h2>
          <p className="text-sm text-muted-foreground">
            You need administrator privileges to view this section. Please
            contact support if you believe this is a mistake.
          </p>
          <Button asChild variant="default">
            <Link href="/">Return to Home</Link>
          </Button>
        </Card>
      </main>
    );
  }

  // If admin is required but not verified yet, don't render children
  if (requireAdmin && !adminVerified) {
    return <LoadingState message="Verifying admin access…" fullScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
