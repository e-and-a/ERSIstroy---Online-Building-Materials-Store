import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/categories/category-form";
import { getCategoryById, getCategoryOptions } from "@/lib/data/categories";
import {
  deleteCategoryAction,
  updateCategoryAction
} from "@/app/admin/(protected)/categories/actions";

type PageProps = {
  params: { id: string };
};

export default async function AdminCategoryDetailsPage({ params }: PageProps) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  const parentOptions = await getCategoryOptions(category.id);
  const hasProducts = category._count.products > 0;
  const updateAction = updateCategoryAction.bind(null, category.id);

  return (
    <section className="admin-category-details-page mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="admin-category-details-page__header flex flex-col gap-2">
        <p className="admin-category-details-page__breadcrumb text-sm text-slate-500">
          <Link href="/admin/categories" className="text-slate-600 hover:text-slate-900">
            Категории
          </Link>{" "}
          / {category.name}
        </p>
        <h1 className="admin-category-details-page__title text-3xl font-semibold">
          Редактирование категории
        </h1>
        <p className="admin-category-details-page__meta text-sm text-slate-500">
          ID: {category.id}
        </p>
      </header>

      <div className="admin-category-details-page__card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <CategoryForm
          action={updateAction}
          categories={parentOptions}
          defaultValues={{
            name: category.name,
            slug: category.slug,
            parentId: category.parentId
          }}
          submitLabel="Сохранить изменения"
        />
        <div className="admin-category-details-page__danger mt-6 border-t border-slate-100 pt-6">
          <form action={deleteCategoryAction} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Удалить категорию</p>
              <p className="text-sm text-slate-500">
                Категорию можно удалить только если к ней не привязаны товары.
              </p>
              {hasProducts && (
                <p className="admin-category-details-page__warning mt-2 text-sm text-red-600">
                  Сначала перенесите или удалите товары ({category._count.products})
                </p>
              )}
            </div>
            <input type="hidden" name="categoryId" value={category.id} />
            <Button
              type="submit"
              variant="outline"
              className="text-red-600 hover:bg-red-50"
              disabled={hasProducts}
            >
              Удалить
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

