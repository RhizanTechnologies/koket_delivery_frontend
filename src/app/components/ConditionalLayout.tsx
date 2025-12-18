"use client";

import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components";
import ScrollToTop from "@/components/ScrollToTop";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <ScrollToTop />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
