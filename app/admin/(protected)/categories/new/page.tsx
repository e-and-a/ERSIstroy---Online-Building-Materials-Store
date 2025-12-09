import Link from "next/link";
import { CategoryForm } from "@/components/categories/category-form";
import { getCategoryOptions } from "@/lib/data/categories";
import { createCategoryAction } from "@/app/admin/(protected)/categories/actions";

export default async function AdminCategoryCreatePage() {
  const categories = await getCategoryOptions();

  return (
    <section className="admin-category-new-page mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="admin-category-new-page__header flex flex-col gap-2">
        <p className="admin-category-new-page__breadcrumb text-sm text-slate-500">
          <Link href="/admin/categories" className="text-slate-600 hover:text-slate-900">
            Категории
          </Link>{" "}
          / Новая категория
        </p>
        <h1 className="admin-category-new-page__title text-3xl font-semibold">
          Новая категория
        </h1>
        <p className="admin-category-new-page__subtitle text-slate-600">
          Укажите название, slug и при необходимости выберите родителя.
        </p>
      </header>

      <div className="admin-category-new-page__card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <CategoryForm
          action={createCategoryAction}
          categories={categories}
          submitLabel="Создать категорию"
        />
      </div>
    </section>
  );
}

