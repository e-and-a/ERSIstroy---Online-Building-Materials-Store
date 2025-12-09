import type { Route } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/products/product-form";
import { getCategoryOptions } from "@/lib/data/categories";
import { createProductAction } from "@/app/admin/(protected)/products/actions";

export default async function AdminProductCreatePage() {
  const categories = await getCategoryOptions();
  const productsListHref = "/admin/products" as Route;

  return (
    <section className="admin-product-new-page mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="admin-product-new-page__header flex flex-col gap-2">
        <p className="admin-product-new-page__breadcrumb text-sm text-slate-500">
          <Link href={productsListHref} className="text-slate-600 hover:text-slate-900">
            Товары
          </Link>{" "}
          / Новый товар
        </p>
        <h1 className="admin-product-new-page__title text-3xl font-semibold">
          Новый товар
        </h1>
        <p className="admin-product-new-page__subtitle text-slate-600">
          Заполните карточку товара, укажите цену и список изображений.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="admin-product-new-page__notice rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          Перед созданием товара добавьте хотя бы одну категорию.
        </div>
      ) : (
        <div className="admin-product-new-page__card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ProductForm
            action={createProductAction}
            categories={categories}
            defaultValues={{
              name: "",
              slug: "",
              description: "",
              categoryId: "",
              price: "",
              unit: "",
              weight: "",
              volume: "",
              isAvailable: true,
              isOnDemand: false,
              images: ""
            }}
            submitLabel="Создать товар"
          />
        </div>
      )}
    </section>
  );
}

