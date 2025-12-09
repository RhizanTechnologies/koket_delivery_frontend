"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton, AuthDivider } from "../components";
import { registerUser } from "@/app/services/authService";
import { useAuth } from "@/app/context/AuthContext";
import { registerSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";

function SignUpPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate input data with Zod
      const validation = validateSafe(registerSchema, {
        name: fullName,
        email,
        password,
        confirmPassword,
      });

      if (!validation.success) {
        setError(validation.error);
        setLoading(false);
        return;
      }

      const response = await registerUser({
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
      });

      const role: "customer" | "admin" =
        response.user.role === "admin" ? "admin" : "customer";

      // Save user & tokens in context/localStorage
      login(
        {
          id: response.user.id ?? "",
          role,
          name: response.user.name ?? "",
          email: response.user.email ?? "",
        },
        response.tokens
      );

      // Redirect after registration
      router.push(role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Join Yellow Cakes today</p>
          </div>

          {/* Google Button */}
          <GoogleAuthButton />
          <AuthDivider />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="pb-2" htmlFor="fullName">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="pb-2" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="pb-2" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="pb-2" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-destructive text-sm mt-1">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-6 text-base cursor-pointer "
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          {/* Redirect to login */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary-hover font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
