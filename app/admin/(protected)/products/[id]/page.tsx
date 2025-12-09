import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/products/product-form";
import { getProductById } from "@/lib/data/products";
import { getCategoryOptions } from "@/lib/data/categories";
import {
  deleteProductAction,
  updateProductAction
} from "@/app/admin/(protected)/products/actions";

type PageProps = {
  params: { id: string };
};

export default async function AdminProductDetailsPage({ params }: PageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const categories = await getCategoryOptions();
  const updateAction = updateProductAction.bind(null, product.id);
  const productsListHref = "/admin/products" as Route;

  return (
    <section className="admin-product-details-page mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="admin-product-details-page__header flex flex-col gap-2">
        <p className="admin-product-details-page__breadcrumb text-sm text-slate-500">
          <Link href={productsListHref} className="text-slate-600 hover:text-slate-900">
            Товары
          </Link>{" "}
          / {product.name}
        </p>
        <h1 className="admin-product-details-page__title text-3xl font-semibold">
          Редактирование товара
        </h1>
        <p className="admin-product-details-page__meta text-sm text-slate-500">
          ID: {product.id}
        </p>
      </header>

      <div className="admin-product-details-page__card rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm
          action={updateAction}
          categories={categories}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description ?? "",
            categoryId: product.categoryId,
            price: product.price.toString(),
            unit: product.unit,
            weight: product.weight?.toString() ?? "",
            volume: product.volume?.toString() ?? "",
            isAvailable: product.isAvailable,
            isOnDemand: product.isOnDemand,
            images: product.images.map((image) => image.url).join(", ")
          }}
          submitLabel="Сохранить изменения"
        />

        <div className="admin-product-details-page__danger mt-6 border-t border-slate-100 pt-6">
          <form action={deleteProductAction} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Удалить товар</p>
              <p className="text-sm text-slate-500">
                Действие необратимо. Товар исчезнет из каталога и заказов.
              </p>
            </div>
            <input type="hidden" name="productId" value={product.id} />
            <Button type="submit" variant="outline" className="text-red-600 hover:bg-red-50">
              Удалить
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

