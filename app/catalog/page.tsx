import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { getCategoriesForCatalog } from "@/lib/data/categories";
import { getProductsForCatalog } from "@/lib/data/products";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    getCategoriesForCatalog(),
    getProductsForCatalog()
  ]);

  return (
    <section className="catalog-page mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-6">
      <header className="catalog-page__header flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="catalog-page__title text-4xl font-semibold text-gray-900">Каталог стройматериалов</h1>
        <p className="catalog-page__subtitle text-gray-600">
          Выберите категорию или просмотрите подборку последних товаров.
        </p>
        <div className="catalog-page__breadcrumbs text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-700">
            Главная
          </Link>{" "}
          / <span className="text-gray-900">Каталог</span>
        </div>
      </header>

      <section className="catalog-page__categories flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Категории
          </p>
          <h2 className="catalog-page__section-title text-3xl font-semibold text-gray-900">
            Быстрый доступ
          </h2>
        </div>
        <div className="catalog-page__chips flex flex-wrap gap-2 rounded-lg bg-white p-3">
          <Link
            href="/catalog"
            className="catalog-page__chip rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-brand-300 hover:bg-brand-50"
          >
            Все категории
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="catalog-page__chip rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-brand-300 hover:bg-brand-50"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="catalog-page__categories-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="catalog-page__category-card flex flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:border-gray-300"
            >
              <span className="catalog-page__category-name text-lg font-semibold text-gray-900">
                {category.name}
              </span>
              <span className="catalog-page__category-count text-sm text-gray-500">
                {category._count.products} товаров
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="catalog-page__products">
        <div className="catalog-page__section-header mb-4 flex items-center justify-between">
          <h2 className="catalog-page__section-title text-2xl font-semibold text-gray-900">
            Подборка товаров
          </h2>
          <p className="catalog-page__section-hint text-sm text-gray-500">
            Показаны последние добавленные позиции
          </p>
        </div>
        <div className="catalog-page__grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </section>
  );
}
