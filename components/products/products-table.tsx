import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/app/admin/(protected)/products/actions";

type ProductWithMeta = Prisma.ProductGetPayload<{
  include: { category: true; images: true };
}>;

type ProductsTableProps = {
  products: ProductWithMeta[];
};

function formatCurrency(value: Prisma.Decimal) {
  const numberValue = typeof value === "string" ? Number(value) : value.toNumber();
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(numberValue);
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="products-table rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="products-table__row products-table__row--head bg-slate-50">
            <TableHead>Название</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="products-table__empty py-10 text-center text-slate-500">
                Товары не найдены.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="products-table__row">
                <TableCell className="products-table__cell">
                  <div className="products-table__main flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-slate-500">{product.slug}</span>
                  </div>
                </TableCell>
                <TableCell className="products-table__cell text-sm text-slate-600">
                  {product.category?.name ?? "—"}
                </TableCell>
                <TableCell className="products-table__cell font-semibold">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="products-table__cell">
                  <div className="products-table__status flex flex-col text-sm">
                    <span className={product.isAvailable ? "text-green-600" : "text-red-600"}>
                      {product.isAvailable ? "В наличии" : "Нет в наличии"}
                    </span>
                    {product.isOnDemand && (
                      <span className="text-xs text-amber-600">Под заказ</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="products-table__cell text-right">
                  <div className="products-table__actions flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="products-table__edit inline-flex h-9 items-center rounded-md bg-slate-900 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Редактировать
                    </Link>
                    <form action={deleteProductAction} className="products-table__delete-form">
                      <input type="hidden" name="productId" value={product.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="products-table__delete text-red-600 hover:bg-red-50"
                      >
                        Удалить
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

