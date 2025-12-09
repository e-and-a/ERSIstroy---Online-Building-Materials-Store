import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ClientShell } from "@/components/layout/client-shell";

export const metadata: Metadata = {
  title: "ERSI Stroy — Интернет-магазин стройматериалов",
  description:
    "Современный интернет-магазин стройматериалов с удобным оформлением заявки."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="app-body bg-[var(--background)] text-[var(--foreground)]">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
