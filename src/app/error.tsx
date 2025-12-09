"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { logger } from "./utils/logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console in development
    logger.error("Application error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 p-4 rounded-full">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, it's not your fault.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
              <p className="text-sm font-mono text-gray-700 break-words">
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-6">
            If the problem persists, please{" "}
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
