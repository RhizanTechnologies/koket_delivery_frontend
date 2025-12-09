"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton, AuthDivider } from "../components";
import { loginUser } from "@/app/services/authService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { loginSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";

function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate input data with Zod
      const validation = validateSafe(loginSchema, { email, password });
      
      if (!validation.success) {
        setError(validation.error);
        setLoading(false);
        return;
      }

      const response = await loginUser(validation.data);
      const role: "customer" | "admin" =
        response.user.role === "admin" ? "admin" : "customer";
      login(
        {
          id: response.user.id,
          role,
          name: response.user.name,
          email: response.user.email,
        },
        response.tokens
      );

      router.push(role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Log in to your Sweet Delights account
            </p>
          </div>

          <GoogleAuthButton />
          <AuthDivider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="pb-2">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="pb-2">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-destructive text-sm mt-1">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-6 text-base cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:text-primary-hover font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
