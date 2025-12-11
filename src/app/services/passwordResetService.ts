/**
 * Password Reset Service
 * Handles OTP-based password reset flow
 */

import { apiClient } from "./api";
import {
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
} from "@/app/schemas/passwordResetSchemas";

/**
 * Step 1: Request OTP
 * Sends OTP to user's email
 */
export async function requestPasswordResetOtp(
  data: ForgotPasswordInput
): Promise<{ message: string }> {
  const response = await apiClient.post("/auth/forgot-password", data);
  return response.data;
}

/**
 * Step 2: Verify OTP
 * Verifies the 6-digit OTP and returns reset token
 */
export async function verifyPasswordResetOtp(
  data: VerifyOtpInput
): Promise<{ resetToken: string; message: string }> {
  const response = await apiClient.post("/auth/verify-otp", data);
  return response.data;
}

/**
 * Step 3: Reset Password
 * Updates password using reset token
 */
export async function resetPassword(data: {
  email: string;
  resetToken: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const response = await apiClient.post("/auth/reset-password", data);
  return response.data;
}

/**
 * Resend OTP
 * Requests a new OTP (same as requestPasswordResetOtp)
 */
export async function resendPasswordResetOtp(
  email: string
): Promise<{ message: string }> {
  return requestPasswordResetOtp({ email });
}
