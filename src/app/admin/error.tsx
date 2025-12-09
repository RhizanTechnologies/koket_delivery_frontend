"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { logger } from "@/app/utils/logger";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    // Log the error
    logger.error("Admin area error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Admin Error
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 mb-6 text-center">
            An error occurred in the admin panel. Please try again or return to the dashboard.
          </p>

          {/* Error Details (development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Error Details:
              </p>
              <p className="text-sm font-mono text-gray-600 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 w-full"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <div className="flex gap-3">
              <Link href="/admin" className="flex-1">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
              
              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Need help?</span> If this error
              persists, please check the browser console for more details or
              contact technical support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
