import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

type OrdersTableProps = {
  orders: OrderWithItems[];
  total: number;
  page: number;
  pageSize: number;
};

const statusMap: Record<
  OrderWithItems["status"],
  { label: string; variant: "default" | "success" | "warning" | "danger" | "neutral" }
> = {
  NEW: { label: "Новый", variant: "warning" },
  CHECKING: { label: "Проверка", variant: "neutral" },
  WAITING_CUSTOMER: { label: "Ожидание клиента", variant: "neutral" },
  CONFIRMED: { label: "Подтвержден", variant: "success" },
  COMPLETED: { label: "Завершен", variant: "default" },
  CANCELED: { label: "Отменен", variant: "danger" }
};

const typeMap: Record<OrderWithItems["type"], string> = {
  order: "Заказ",
  calculation_request: "Расчет"
};

function formatCurrency(value?: Prisma.Decimal | null) {
  if (!value) return "—";
  const numberValue = typeof value === "string" ? Number(value) : value.toNumber();
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(numberValue);
}

export function OrdersTable({ orders, total, page, pageSize }: OrdersTableProps) {
  return (
    <div className="orders-table flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="orders-table__header flex flex-col gap-1">
        <p className="orders-table__meta text-sm text-slate-500">
          Найдено заявок: {total}
        </p>
        <p className="orders-table__hint text-xs text-slate-400">
          Кликните по строке, чтобы перейти к деталям заказа.
        </p>
      </header>

      <div className="orders-table__scroll -mx-4 overflow-x-auto">
        <Table className="orders-table__table min-w-full">
          <TableHeader>
            <TableRow className="orders-table__row orders-table__row--head bg-slate-50">
              <TableHead>ID</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="orders-table__empty py-10 text-center text-slate-500"
                >
                  Заявки не найдены.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="orders-table__row relative cursor-pointer"
                >
                  <TableCell className="orders-table__cell">{order.id}</TableCell>
                  <TableCell className="orders-table__cell">
                    <div className="orders-table__customer flex flex-col">
                      <span className="orders-table__customer-name font-medium">
                        {order.customerName}
                      </span>
                      <span className="orders-table__customer-contact text-xs text-slate-500">
                        {order.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="orders-table__cell text-sm text-slate-600">
                    {typeMap[order.type]}
                  </TableCell>
                  <TableCell className="orders-table__cell">
                    <Badge variant={statusMap[order.status].variant}>
                      {statusMap[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="orders-table__cell font-medium">
                    {formatCurrency(order.totalPriceClient)}
                  </TableCell>
                  <TableCell className="orders-table__cell text-sm text-slate-600">
                    {new Intl.DateTimeFormat("ru-RU", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }).format(order.createdAt)}
                  </TableCell>
                  <TableCell className="orders-table__cell text-right text-sm text-brand-accent">
                    Подробнее →
                  </TableCell>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    aria-label={`Открыть заказ ${order.id}`}
                    className="orders-table__row-link absolute inset-0"
                  />
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <footer className="orders-table__footer flex items-center justify-between text-sm text-slate-500">
        <span>
          Страница {page} из {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <span>Показывается по {pageSize} заявок</span>
      </footer>
    </div>
  );
}

