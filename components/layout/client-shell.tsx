"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="site-shell flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      {!isAdminRoute && <SiteHeader />}
      <main className="site-shell__main flex-1">{children}</main>
      {!isAdminRoute && <SiteFooter />}
    </div>
  );
}
