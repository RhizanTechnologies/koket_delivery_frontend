# Password Reset with OTP - Implementation Guide

## 🎯 Overview

Complete 3-step OTP-based password reset flow implementation:

1. **Forgot Password** - Request OTP via email
2. **Verify OTP** - Enter 6-digit code
3. **Reset Password** - Set new password

## 📱 User Flow

```
┌─────────────────┐
│  Login Page     │
│  "Forgot?"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Forgot Password │  ← Enter email
│  Request OTP    │  → POST /auth/forgot-password
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verify OTP     │  ← Enter 6-digit code
│  (Auto-submit)  │  → POST /auth/verify-otp
└────────┬────────┘     → Returns resetToken
         │
         ▼
┌─────────────────┐
│ Reset Password  │  ← Enter new password
│  Update & Done  │  → POST /auth/reset-password
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Login Page     │  ← Success! Login with new password
└─────────────────┘
```

## 🗂️ Files Created

### Service Layer

**`src/app/services/passwordResetService.ts`**

- `requestPasswordResetOtp()` - Request OTP via email
- `verifyPasswordResetOtp()` - Verify OTP and get reset token
- `resetPassword()` - Update password with reset token
- `resendPasswordResetOtp()` - Resend OTP with cooldown

### Schemas

**`src/app/schemas/passwordResetSchemas.ts`**

- `forgotPasswordSchema` - Email validation
- `verifyOtpSchema` - Email + 6-digit OTP validation
- `resetPasswordSchema` - Password + confirmation validation

### Pages

**`src/app/auth/forgot-password/page.tsx`**

- Step 1: Request OTP form
- Email input with validation
- Shows success message
- Auto-redirects to verify OTP page

**`src/app/auth/verify-otp/page.tsx`**

- Step 2: OTP verification
- 6-digit input boxes (auto-advance)
- Auto-submit when all 6 digits entered
- Paste support (Ctrl+V)
- Resend OTP with 60s cooldown
- Returns resetToken on success

**`src/app/auth/reset-password/page.tsx`**

- Step 3: New password form
- Password strength validation
- Show/hide password toggles
- Confirmation password matching
- Success screen with auto-redirect

### Updated Files

**`src/app/auth/login/page.tsx`**

- Added "Forgot password?" link

## 🔒 Security Features

### Rate Limiting

- **Request OTP**: Max 3 requests per email per hour (backend)
- **Verify OTP**: Max 5 attempts per OTP (backend)
- **Resend OTP**: 60-second cooldown (frontend)

### OTP Security

- 6-digit numeric code (easy to type)
- 10-minute expiry
- Hashed before storage (bcrypt)
- Invalidated after successful reset
- Invalidated after max failed attempts

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Must match confirmation

### Reset Token

- Short-lived (10 minutes)
- Single-use only
- Passed via URL query parameter
- Validated before password reset

## 📋 API Endpoints Expected

### 1. Request OTP

```typescript
POST /api/v1/auth/forgot-password
Body: {
  email: string
}

Response: {
  message: "OTP sent to email"
}

Errors:
- 400: Email not found
- 429: Too many requests (rate limit)
```

### 2. Verify OTP

```typescript
POST /api/v1/auth/verify-otp
Body: {
  email: string,
  otp: string // 6 digits
}

Response: {
  resetToken: string, // Short-lived token
  message: "OTP verified successfully"
}

Errors:
- 400: Invalid OTP
- 400: OTP expired
- 429: Too many verification attempts
```

### 3. Reset Password

```typescript
POST /api/v1/auth/reset-password
Body: {
  resetToken: string,
  newPassword: string
}

Response: {
  message: "Password reset successful"
}

Errors:
- 400: Invalid or expired reset token
- 400: Weak password
```

## 🎨 UI/UX Features

### Forgot Password Page

- Clean, centered layout
- Email validation before submission
- Loading state with spinner
- Success screen with countdown
- Security note about rate limits
- Back to login link

### Verify OTP Page

- 6 individual input boxes
- Auto-focus next input on digit entry
- Auto-focus previous on backspace
- Auto-submit when all 6 digits entered
- Paste support (Ctrl+V full 6-digit code)
- Resend OTP button with cooldown timer
- Clear inputs on error
- Email display for confirmation
- Security note about expiry

### Reset Password Page

- Password strength requirements shown
- Show/hide password toggles
- Real-time validation errors
- Password match validation
- Success screen with auto-redirect
- Back to login link

## 🧪 Testing Checklist

### Forgot Password

- [ ] Valid email submits successfully
- [ ] Invalid email shows error
- [ ] Empty email shows error
- [ ] Shows success message
- [ ] Redirects to verify OTP page
- [ ] Email passed as query parameter

### Verify OTP

- [ ] Auto-focus first input on load
- [ ] Can type 6 digits
- [ ] Auto-advances to next input
- [ ] Auto-submits when all 6 entered
- [ ] Backspace moves to previous input
- [ ] Paste 6-digit code works
- [ ] Invalid OTP shows error
- [ ] Inputs clear on error
- [ ] Resend button works
- [ ] Resend cooldown works (60s)
- [ ] Redirects to reset password with token

### Reset Password

- [ ] Password requirements shown
- [ ] Show/hide password works
- [ ] Weak password shows validation error
- [ ] Password mismatch shows error
- [ ] Valid submission works
- [ ] Shows success screen
- [ ] Redirects to login page
- [ ] Cannot access without reset token

### Integration

- [ ] Full flow works end-to-end
- [ ] Rate limiting respected
- [ ] OTP expiry handled
- [ ] Token expiry handled
- [ ] Can login with new password

## 🎯 Usage Example

### Service Layer Usage

```typescript
import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  resendPasswordResetOtp,
} from "@/app/services/passwordResetService";

// Step 1: Request OTP
try {
  const response = await requestPasswordResetOtp({ email: "user@example.com" });
  console.log(response.message); // "OTP sent to email"
} catch (error) {
  // Handle error (rate limit, email not found, etc.)
}

// Step 2: Verify OTP
try {
  const response = await verifyPasswordResetOtp({
    email: "user@example.com",
    otp: "123456",
  });
  const resetToken = response.resetToken; // Use this for step 3
} catch (error) {
  // Handle error (invalid OTP, expired, max attempts, etc.)
}

// Step 3: Reset Password
try {
  const response = await resetPassword({
    resetToken: "token-from-step-2",
    newPassword: "NewSecurePass123",
  });
  console.log(response.message); // "Password reset successful"
} catch (error) {
  // Handle error (invalid token, weak password, etc.)
}

// Resend OTP (if needed)
try {
  await resendPasswordResetOtp("user@example.com");
} catch (error) {
  // Handle error
}
```

### Full User Flow

```typescript
// User clicks "Forgot password?" on login page
// → Navigates to /auth/forgot-password

// User enters email and clicks "Send OTP"
// → Calls requestPasswordResetOtp()
// → API sends OTP to email
// → Shows success, redirects to /auth/verify-otp?email=...

// User enters 6-digit OTP (or pastes it)
// → Auto-submits when complete
// → Calls verifyPasswordResetOtp()
// → API returns resetToken
// → Redirects to /auth/reset-password?token=...&email=...

// User enters new password
// → Validates strength and match
// → Calls resetPassword()
// → API updates password
// → Shows success, redirects to /auth/login

// User logs in with new password ✅
```

## 🔧 Backend Requirements

### User Model Updates

```typescript
{
  password_reset_otp?: string, // Hashed OTP
  password_reset_otp_expires?: Date, // Expiry timestamp
  password_reset_attempts?: number, // Failed verification count
  last_otp_request?: Date, // Last request time
  otp_request_count?: number, // Requests in current hour
}
```

### Email Service

Recommended: **Resend** or **SendGrid**

Email template should include:

- 6-digit OTP prominently displayed
- Expiry time (10 minutes)
- Security warning about not sharing
- Contact support link

Example:

```
Your password reset code is: 123456

This code will expire in 10 minutes.

If you didn't request this, please ignore this email or contact support.
```

## 🚀 Deployment Checklist

- [ ] Email service configured (Resend/SendGrid)
- [ ] Rate limiting implemented on backend
- [ ] OTP expiry logic working (10 minutes)
- [ ] Reset token expiry working (10 minutes)
- [ ] Email templates tested and working
- [ ] HTTPS enabled (required for security)
- [ ] Error logging configured
- [ ] Success/failure metrics tracked

## 📝 Environment Variables

Backend needs:

```env
EMAIL_SERVICE_API_KEY=your_api_key
EMAIL_FROM=noreply@yourdomain.com
OTP_EXPIRY_MINUTES=10
RESET_TOKEN_EXPIRY_MINUTES=10
MAX_OTP_REQUESTS_PER_HOUR=3
MAX_OTP_VERIFICATION_ATTEMPTS=5
```

## 🎉 Success!

Users can now:

- ✅ Reset forgotten passwords securely
- ✅ Receive OTP via email
- ✅ Verify identity with 6-digit code
- ✅ Set new password with strength requirements
- ✅ Login immediately after reset

All with proper security measures and great UX!
