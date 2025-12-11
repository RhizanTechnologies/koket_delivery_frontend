"use client";

/**
 * Verify OTP Page - Step 2
 * Verify the 6-digit OTP sent to email
 */

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  verifyOtpSchema,
  type VerifyOtpInput,
} from "@/app/schemas/passwordResetSchemas";
import {
  verifyPasswordResetOtp,
  resendPasswordResetOtp,
} from "@/app/services/passwordResetService";
import { logger } from "@/app/utils/logger";
import { Button } from "@/components/ui/button";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Refs for OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newOtp.every((digit) => digit) && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or submit
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (otpString?: string) => {
    const otpValue = otpString || otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Validate input
      const validated = verifyOtpSchema.parse({
        email,
        otp: otpValue,
      });

      // Verify OTP
      const response = await verifyPasswordResetOtp(validated);

      logger.info("OTP verified successfully", { email: validated.email });

      // Store reset token and redirect to reset password page
      const resetToken = response.resetToken;
      router.push(
        `/auth/reset-password?token=${encodeURIComponent(
          resetToken
        )}&email=${encodeURIComponent(email)}`
      );
    } catch (err: any) {
      if (err.name === "ZodError") {
        setError(err.errors[0].message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid OTP. Please try again.");
      }
      logger.error("Failed to verify OTP", { error: err, email });

      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setIsLoading(true);

    try {
      await resendPasswordResetOtp(email);
      logger.info("OTP resent successfully", { email });

      setResendCooldown(60); // 60 second cooldown
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      // Show success message
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      logger.error("Failed to resend OTP", { error: err, email });
    } finally {
      setIsLoading(false);
    }
  };

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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Verify OTP
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Enter the 6-digit code sent to
            </p>
            <p className="text-foreground font-medium text-xs sm:text-sm mt-1 break-all px-2">
              {email}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-4 sm:mb-6">
            <div
              className="flex gap-1.5 sm:gap-2 justify-center"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={() => handleSubmit()}
            disabled={isLoading || otp.some((digit) => !digit)}
            loading={isLoading}
            className="w-full mb-3 sm:mb-4 py-2.5 sm:py-3 text-sm sm:text-base"
            size="lg"
          >
            Verify OTP
          </Button>

          {/* Resend OTP */}
          <div className="text-center mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              variant="link"
              className="text-xs sm:text-sm h-auto p-0"
            >
              {resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : "Resend OTP"}
            </Button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Use different email
            </Link>
          </div>

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Security:</strong> OTP expires in 10 minutes. Maximum 5
              verification attempts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
