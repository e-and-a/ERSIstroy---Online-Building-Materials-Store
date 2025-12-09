import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { getProductBySlug } from "@/lib/data/products";

type ProductPageProps = {
  params: { slug: string };
};

function formatCurrency(value: { toNumber(): number } | string) {
  const numberValue =
    typeof value === "string" ? Number(value) : typeof value === "object" ? value.toNumber() : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(numberValue);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="product-page mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <header className="product-page__header flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
        <p className="product-page__breadcrumbs text-sm text-gray-500">
          <Link href="/catalog" className="text-gray-600 hover:text-brand-700">
            Каталог
          </Link>
          {product.category && (
            <>
              {" "}
              /{" "}
              <Link
                href={`/catalog/${product.category.slug}`}
                className="text-gray-600 hover:text-brand-700"
              >
                {product.category.name}
              </Link>
            </>
          )}
        </p>
        <h1 className="product-page__title text-4xl font-semibold text-gray-900">
          {product.name}
        </h1>
        <p className="product-page__notice text-sm text-gray-500">
          Информация не является публичной офертой. Окончательная стоимость и наличие уточняются
          менеджером.
        </p>
      </header>

      <div className="product-page__layout grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="product-page__gallery space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="product-page__section-title text-xl font-semibold text-gray-900">
              Галерея
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
              {product.images.length || 0} фото
            </span>
          </div>
          {product.images.length > 0 ? (
            <div className="product-page__images grid gap-4 sm:grid-cols-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="product-page__image-wrapper overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                >
                  <img
                    src={image.url}
                    alt={`${product.name} — изображение`}
                    className="product-page__image h-56 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="product-page__image-placeholder rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              Изображения скоро появятся.
            </div>
          )}
          {product.description && (
            <div className="product-page__description space-y-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Описание
              </p>
              <p className="text-base leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>

        <aside className="product-page__info flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-28">
          <div className="product-page__price-block">
            <p className="text-sm uppercase text-gray-500">Стоимость</p>
            <div className="product-page__price text-4xl font-bold text-gray-900">
              {formatCurrency(product.price)}
              <span className="product-page__unit ml-2 text-lg font-medium text-gray-500">
                / {product.unit}
              </span>
            </div>
            <p className="muted mt-1 text-gray-500">
              Цена и наличие уточняются менеджером после оформления заявки.
            </p>
          </div>

          <div className="product-page__badge grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              Быстрая обработка
              <p className="text-xs text-gray-500">Ответ до 1 рабочего дня</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              Консультации
              <p className="text-xs text-gray-500">Подбор и замены</p>
            </div>
          </div>

          <div className="product-page__actions">
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price:
                  typeof product.price === "string"
                    ? Number(product.price)
                    : product.price.toNumber(),
                unit: product.unit,
                image: product.images[0]?.url
              }}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
