"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAdmin>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
