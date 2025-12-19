"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton, AuthDivider } from "../components";
import { loginUser } from "@/app/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { loginSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Cookie, Eye, EyeOff } from "lucide-react";

function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [floatingCookies, setFloatingCookies] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate floating cookies
  useEffect(() => {
    const cookies = [];
    for (let i = 0; i < 8; i++) {
      cookies.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
      });
    }
    setFloatingCookies(cookies);
  }, []);

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      setSessionExpired(true);
      setTimeout(() => setSessionExpired(false), 5000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validation = validateSafe(loginSchema, { email, password });
      if (!validation.success) {
        setError(validation.error);
        return;
      }

      const response = await loginUser(validation.data);
      const role = response.user.role === "admin" ? "admin" : "customer";

      login(
        {
          id: response.user.id,
          role,
          name: response.user.name,
          email: response.user.email,
        },
        response.tokens
      );

      // Add success animation before redirect
      setTimeout(() => {
        router.push(role === "admin" ? "/admin" : "/");
      }, 600);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-orange-50/30 dark:to-orange-950/10 px-4 overflow-hidden relative pt-4">
      {/* Floating animated cookies */}
      <AnimatePresence>
        {floatingCookies.map((cookie) => (
          <motion.div
            key={cookie.id}
            initial={{
              opacity: 0,
              y: cookie.y + 100,
              rotate: 0,
            }}
            animate={{
              opacity: 0.7,
              y: cookie.y,
              rotate: 360,
            }}
            transition={{
              duration: 15 + cookie.id,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="absolute pointer-events-none"
            style={{
              left: `${cookie.x}%`,
              top: `${cookie.y}%`,
            }}
          >
            <Cookie
              size={cookie.size}
              className="text-amber-600/30 dark:text-amber-400/20"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Soft floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/10 dark:bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -30, 30, -20],
              x: [null, 20, -20, 10],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-50/20 via-amber-50/10 to-orange-50/20 dark:from-rose-950/10 dark:via-amber-950/5 dark:to-orange-950/10"
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        ref={containerRef}
        className="w-full max-w-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{
            rotate: isHovered ? [0, -1, 1, -1, 0] : 0,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Card glow effect */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0.5,
            }}
            className="absolute -inset-4 bg-gradient-to-r from-rose-400/20 via-amber-400/20 to-orange-400/20 dark:from-rose-600/10 dark:via-amber-600/10 dark:to-orange-600/10 blur-2xl rounded-3xl -z-10"
          />

          {/* Decorative corner accents */}
          <motion.div
            animate={{
              scale: isHovered ? 1 : 0.9,
            }}
            className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg"
          />
          <motion.div
            animate={{
              scale: isHovered ? 1 : 0.9,
            }}
            className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg"
          />
          <motion.div
            animate={{
              scale: isHovered ? 1 : 0.9,
            }}
            className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg"
          />
          <motion.div
            animate={{
              scale: isHovered ? 1 : 0.9,
            }}
            className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-lg"
          />

          {/* Main card */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-2xl overflow-hidden">
            {/* Header with animation */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative p-8 sm:p-10"
            >
              {/* Sparkle effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4"
              >
                <Sparkles className="w-6 h-6 text-amber-500/30" />
              </motion.div>

              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  className="inline-block p-3 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-2xl mb-4"
                >
                  <Cookie className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent mb-2"
                >
                  Welcome back! 🍪
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-muted-foreground"
                >
                  Log in to your Sweet Delights account
                </motion.p>
              </div>

              {/* OAuth */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GoogleAuthButton />
                <AuthDivider />
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-1.5"
                >
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-primary transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-1.5"
                >
                  <Label className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-primary transition-all duration-300 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </motion.div>

                {/* Session expired */}
                <AnimatePresence>
                  {sessionExpired && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-lg border border-amber-300/40 bg-amber-50/50 dark:bg-amber-900/10 px-4 py-3"
                    >
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        Session expired
                      </p>
                      <p className="text-xs mt-1 text-amber-700/80 dark:text-amber-300/80">
                        Please log in again to continue.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
                    >
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Logging in...
                      </span>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-primary font-medium hover:text-primary/80 transition-colors hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
