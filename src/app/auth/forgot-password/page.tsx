"use client";

/**
 * Forgot Password Page - Step 1
 * Request OTP to be sent to email
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/app/schemas/passwordResetSchemas";
import { requestPasswordResetOtp } from "@/app/services/passwordResetService";
import { logger } from "@/app/utils/logger";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate input
      const validated = forgotPasswordSchema.parse({ email });

      // Request OTP
      const response = await requestPasswordResetOtp(validated);

      logger.info("OTP requested successfully", { email: validated.email });

      setSuccess(true);

      // Redirect to verify OTP page after 2 seconds
      setTimeout(() => {
        router.push(
          `/auth/verify-otp?email=${encodeURIComponent(validated.email)}`
        );
      }, 2000);
    } catch (err: any) {
      if (err.name === "ZodError") {
        setError(err.errors[0].message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
      logger.error("Failed to request OTP", { error: err, email });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Check Your Email
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
              We've sent a 6-digit OTP to{" "}
              <strong className="break-all">{email}</strong>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Redirecting to verification page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Enter your email and we'll send you a 6-digit OTP to reset your
              password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                disabled={isLoading}
                autoFocus
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              className="w-full py-2.5 sm:py-3 text-sm sm:text-base"
              size="lg"
            >
              Send OTP
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-xs sm:text-sm text-primary hover:text-primary-hover transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Security:</strong> OTP will expire in 10 minutes. Maximum
              3 requests per hour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
