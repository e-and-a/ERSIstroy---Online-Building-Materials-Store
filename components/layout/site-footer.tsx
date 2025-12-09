import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-gray-200 bg-white">
      <div className="site-footer__inner mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="site-footer__brand space-y-1">
          <p className="text-sm font-semibold text-gray-900">ERSI STROY</p>
          <p className="site-footer__text text-sm text-gray-500">
            Каталог стройматериалов с доставкой и поддержкой менеджеров.
          </p>
        </div>
        <div className="site-footer__links flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <Link href="/terms" className="hover:text-brand-700">
            Пользовательское соглашение
          </Link>
          <Link href="/privacy" className="hover:text-brand-700">
            Конфиденциальность
          </Link>
          <a href="mailto:info@ersi-stroy.ru" className="hover:text-brand-700">
            info@ersi-stroy.ru
          </a>
          <a href="tel:+79990000000" className="hover:text-brand-700">
            +7 (999) 000-00-00
          </a>
        </div>
      </div>
    </footer>
  );
}
