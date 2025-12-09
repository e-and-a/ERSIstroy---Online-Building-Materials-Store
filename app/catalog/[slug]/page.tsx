import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategorySlug } from "@/lib/data/products";

type PageProps = {
  params: { slug: string };
};

export default async function CatalogCategoryPage({ params }: PageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategorySlug(category.slug);

  return (
    <section className="catalog-category-page mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <header className="catalog-category-page__header flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
        <p className="catalog-category-page__breadcrumbs text-sm text-gray-500">
          <Link href="/catalog" className="text-gray-600 hover:text-brand-700">
            Каталог
          </Link>{" "}
          / {category.name}
        </p>
        <h1 className="catalog-category-page__title text-4xl font-semibold text-gray-900">
          {category.name}
        </h1>
        <p className="catalog-category-page__subtitle text-gray-600">
          Найдено товаров: {products.length}. Добавьте позиции в корзину и отправьте заявку на расчет.
        </p>
      </header>

      <div className="catalog-category-page__grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="catalog-category-page__empty rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 md:col-span-3">
            В этой категории пока нет товаров.
          </div>
        )}
      </div>
    </section>
  );
}
