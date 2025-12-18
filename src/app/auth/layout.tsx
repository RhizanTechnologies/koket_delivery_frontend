import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Back to Home Button - Hidden on mobile, shown on larger screens as fixed */}
      <div className="hidden sm:block absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link href="/">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>

      {/* Back to Home Button for Mobile - Above content */}
      <div className="sm:hidden px-4 pt-4 pb-2">
        <Link href="/">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>

      {/* Auth Page Content */}
      {children}
    </div>
  );
}
