"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/catalog", label: "Каталог", match: "/catalog" },
  { href: "/cart", label: "Корзина", match: "/cart" },
  { href: "/order", label: "Оформить заказ", match: "/order" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="site-header__inner mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <Link
          href="/"
          className="site-header__brand text-lg font-semibold uppercase tracking-tight text-gray-900"
        >
          ERSI STROY
        </Link>

        <nav className="site-header__nav hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.match ||
              (!!link.match && pathname?.startsWith(link.match) && link.match !== "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`site-header__link rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "text-brand-700 underline decoration-brand-300"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header__actions hidden items-center gap-3 md:flex">
          <a
            href="tel:+79990000000"
            className="site-header__phone text-sm font-semibold text-gray-900"
          >
            +7 (999) 000-00-00
          </a>
          <Link
            href="/cart"
            className="site-header__cart inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-brand-300 hover:bg-brand-50"
          >
            Корзина
          </Link>
          <Link href="/order" className="site-header__cta inline-flex">
            <Button size="sm" className="bg-brand-600 text-white hover:bg-brand-500">
              Оформить заявку
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="site-header__burger inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Меню"
        >
          <span className="sr-only">Открыть меню</span>
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div className="site-header__nav-mobile border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.match ||
                (!!link.match && pathname?.startsWith(link.match) && link.match !== "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`site-header__link-mobile rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "text-brand-700 underline" : "text-gray-700 hover:text-brand-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="tel:+79990000000"
              className="site-header__phone text-sm font-semibold text-gray-900"
            >
              +7 (999) 000-00-00
            </a>
            <Link
              href="/cart"
              className="site-header__cart block rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-semibold text-gray-900 transition hover:border-brand-300 hover:bg-brand-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Корзина
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
