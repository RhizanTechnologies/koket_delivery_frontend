"use client";

import { Cake } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  message?: string;
  subtitle?: string;
  fullScreen?: boolean;
  className?: string;
};

export default function LoadingState({
  message = "Loading…",
  subtitle,
  fullScreen = true,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        fullScreen ? "min-h-screen bg-background" : "py-12",
        className
      )}
    >
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Cake className="w-8 h-8 text-primary" />
        </div>
      </div>
      <p className="mt-6 text-gray-700 font-medium text-lg">{message}</p>
      {subtitle && <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );
}
