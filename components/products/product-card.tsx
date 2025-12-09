import Link from "next/link";
import type { Prisma, Unit } from "@prisma/client";

type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  price: Prisma.Decimal;
  unit: Unit;
  category: {
    name: string;
    slug: string;
  } | null;
  images: { id: string; url: string }[];
};

type ProductCardProps = {
  product: CatalogProduct;
};

function formatCurrency(value: Prisma.Decimal) {
  const numberValue = typeof value === "string" ? Number(value) : value.toNumber();
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(numberValue);
}

export function ProductCard({ product }: ProductCardProps) {
  const cover = product.images[0]?.url;
  const categoryHref = product.category ? `/catalog/${product.category.slug}` : undefined;

  return (
    <article className="product-card flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-gray-300">
      <Link
        href={`/product/${product.slug}`}
        className="product-card__image-wrapper block h-48 overflow-hidden bg-gray-100"
      >
        {cover ? (
          <img
            src={cover}
            alt={product.name}
            className="product-card__image h-full w-full object-cover"
          />
        ) : (
          <div className="product-card__image-placeholder flex h-full w-full items-center justify-center text-slate-400">
            Нет изображения
          </div>
        )}
      </Link>

      <div className="product-card__body flex flex-1 flex-col gap-3 p-4">
        {product.category && categoryHref && (
          <Link
            href={categoryHref}
            className="product-card__category inline-flex w-fit rounded-md bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700"
          >
            {product.category.name}
          </Link>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="product-card__title text-lg font-semibold text-gray-900 transition hover:text-brand-700"
        >
          {product.name}
        </Link>

        <div className="product-card__price text-xl font-bold text-gray-900">
          {formatCurrency(product.price)}
          <span className="product-card__unit ml-2 text-sm font-medium text-gray-500">
            / {product.unit}
          </span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="product-card__cta mt-auto inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
