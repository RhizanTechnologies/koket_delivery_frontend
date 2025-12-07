"use client";

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
        fullScreen
          ? "min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50"
          : "py-12",
        className
      )}
    >
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-pink-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </div>
      </div>
      <p className="mt-6 text-gray-700 font-medium text-lg">{message}</p>
      {subtitle && <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );
}
