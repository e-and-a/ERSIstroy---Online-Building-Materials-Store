import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteCategoryAction } from "@/app/admin/(protected)/categories/actions";

type CategoryWithMeta = Prisma.CategoryGetPayload<{
  include: { parent: true; _count: { select: { products: true } } };
}>;

type CategoriesTableProps = {
  categories: CategoryWithMeta[];
};

export function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <div className="categories-table rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="categories-table__row categories-table__row--head bg-slate-50">
            <TableHead>Название</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Родитель</TableHead>
            <TableHead>Товаров</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="categories-table__empty py-10 text-center text-slate-500">
                Категории не найдены.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => {
              const hasProducts = category._count.products > 0;

              return (
                <TableRow key={category.id} className="categories-table__row">
                  <TableCell className="categories-table__cell">
                    <div className="categories-table__main flex flex-col">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-xs text-slate-500">
                        Создана{" "}
                        {new Intl.DateTimeFormat("ru-RU", {
                          dateStyle: "medium"
                        }).format(category.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="categories-table__cell text-sm text-slate-600">
                    {category.slug}
                  </TableCell>
                  <TableCell className="categories-table__cell text-sm text-slate-600">
                    {category.parent?.name ?? "—"}
                  </TableCell>
                  <TableCell className="categories-table__cell text-sm text-slate-600">
                    {category._count.products}
                  </TableCell>
                  <TableCell className="categories-table__cell text-right">
                    <div className="categories-table__actions flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="categories-table__edit inline-flex h-9 items-center rounded-md bg-slate-900 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        Редактировать
                      </Link>
                      <form action={deleteCategoryAction} className="categories-table__delete-form">
                        <input type="hidden" name="categoryId" value={category.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="categories-table__delete text-red-600 hover:bg-red-50"
                          disabled={hasProducts}
                        >
                          Удалить
                        </Button>
                      </form>
                    </div>
                    {hasProducts && (
                      <p className="categories-table__hint mt-1 text-xs text-slate-400">
                        Нельзя удалить категорию с товарами
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

