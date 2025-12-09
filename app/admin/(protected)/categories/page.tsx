import Link from "next/link";
import { CategoriesTable } from "@/components/categories/categories-table";
import { getCategoriesWithMeta } from "@/lib/data/categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithMeta();

  return (
    <section className="admin-categories-page mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="admin-categories-page__header flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="admin-categories-page__headings flex flex-col gap-1">
          <h1 className="admin-categories-page__title text-3xl font-semibold">Категории</h1>
          <p className="admin-categories-page__subtitle text-slate-600">
            Управляйте иерархией каталога и привязками товаров.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="admin-categories-page__create inline-flex h-10 items-center rounded-md bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Новая категория
        </Link>
      </header>

      <CategoriesTable categories={categories} />
    </section>
  );
}

