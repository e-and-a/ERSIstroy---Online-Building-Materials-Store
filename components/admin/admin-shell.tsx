// components/admin/admin-shell.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="admin-shell min-h-screen bg-[#f8f9fb] text-slate-900">
      {/* HEADER */}
      <header className="admin-shell__header border-b border-gray-200 bg-white">
        <div className="admin-shell__header-inner mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          {/* BRAND + LINK TO ORDERS */}
          <div className="admin-shell__brand flex flex-col gap-0.5">
            <Link
              href="/admin/orders"
              className="admin-shell__title text-sm font-semibold tracking-[0.18em] text-brand-700 uppercase hover:text-brand-800 transition"
            >
              ERSI STROY
            </Link>
            <span className="admin-shell__subtitle text-xs text-gray-500">
              Админ-панель / управление каталогом и заказами
            </span>
          </div>

          {/* ACTIONS: GO TO SITE + LOGOUT */}
          <div className="admin-shell__actions flex items-center gap-3">
            <Link
              href="/"
              className="admin-shell__to-site rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand-300 hover:bg-brand-50"
            >
              Перейти на сайт
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* ADMIN NAV */}
        <nav className="admin-shell__nav border-t border-gray-200 bg-slate-50/80">
          <div className="admin-shell__nav-inner mx-auto flex w-full max-w-6xl gap-2 px-4 py-2 md:px-6">
            <Link
              href="/admin/orders"
              className="admin-shell__nav-link inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-brand-700 hover:shadow-sm"
            >
              Заказы
            </Link>
            <Link
              href="/admin/categories"
              className="admin-shell__nav-link inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-brand-700 hover:shadow-sm"
            >
              Категории
            </Link>
            <Link
              href="/admin/products"
              className="admin-shell__nav-link inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-brand-700 hover:shadow-sm"
            >
              Товары
            </Link>
          </div>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main className="admin-shell__main mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
        <div className="admin-shell__content w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}


/**import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="admin-shell__header sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="admin-shell__brand text-lg font-semibold text-[var(--foreground)]"
          >
            ERSI Admin
          </Link>
          <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            На сайт
          </Link>
        </div>
        <LogoutButton />
      </header>
      <main className="admin-shell__content px-6 pb-10 pt-6">{children}</main>
    </div>
  );
}
*/