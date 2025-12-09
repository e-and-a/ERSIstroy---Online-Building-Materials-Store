import type { Route } from "next";
import Link from "next/link";
import { ProductsTable } from "@/components/products/products-table";
import { getProductsWithMeta } from "@/lib/data/products";

export default async function AdminProductsPage() {
  const products = await getProductsWithMeta();
  const newProductHref = "/admin/products/new" as Route;

  return (
    <section className="admin-products-page mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="admin-products-page__header flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="admin-products-page__headings flex flex-col gap-1">
          <h1 className="admin-products-page__title text-3xl font-semibold">Товары</h1>
          <p className="admin-products-page__subtitle text-slate-600">
            Управляйте карточками товаров и загрузкой изображений.
          </p>
        </div>
        <Link
          href={newProductHref}
          className="admin-products-page__create inline-flex h-10 items-center rounded-md bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Новый товар
        </Link>
      </header>

      <ProductsTable products={products} />
    </section>
  );
}

