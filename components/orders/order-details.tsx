import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { Prisma } from "@prisma/client";
import { OrderStatusForm } from "./order-status-form";

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

const contactMethodMap: Record<OrderWithItems["contactMethod"], string> = {
  call: "Звонок",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  email: "Email"
};

const statusLabels: Record<OrderWithItems["status"], string> = {
  NEW: "Новый",
  CHECKING: "Проверка",
  WAITING_CUSTOMER: "Ожидание клиента",
  CONFIRMED: "Подтвержден",
  COMPLETED: "Завершен",
  CANCELED: "Отменен"
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

export function OrderDetails({ order }: { order: OrderWithItems }) {
  return (
    <div className="order-details flex flex-col gap-8">
      <div className="order-details__grid grid gap-6 lg:grid-cols-2">
        <div className="order-details__panel rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="order-details__panel-title text-lg font-semibold">Клиент</h2>
          <Separator className="my-4" />
          <ul className="order-details__list flex flex-col gap-3 text-sm">
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Имя</span>
              <span className="font-medium">{order.customerName}</span>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Телефон</span>
              <span className="font-medium">{order.phone}</span>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="font-medium">{order.email}</span>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Город</span>
              <span className="font-medium">{order.city}</span>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Связь</span>
              <span className="font-medium">
                {contactMethodMap[order.contactMethod]}
              </span>
            </li>
          </ul>
        </div>

        <div className="order-details__panel rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="order-details__panel-title text-lg font-semibold">
            Информация о заказе
          </h2>
          <Separator className="my-4" />
          <ul className="order-details__list flex flex-col gap-3 text-sm">
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Статус</span>
              <Badge variant="neutral">{statusLabels[order.status]}</Badge>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Тип заявки</span>
              <span className="font-medium">
                {order.type === "order" ? "Заказ" : "Расчет"}
              </span>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Создан</span>
              <span className="font-medium">
                {new Intl.DateTimeFormat("ru-RU", {
                  dateStyle: "medium",
                  timeStyle: "short"
                }).format(order.createdAt)}
              </span>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Комментарий клиента</span>
              <span className="order-details__comment text-right text-sm text-slate-600">
                {order.comment || "—"}
              </span>
            </li>
            <li className="order-details__list-item flex justify-between">
              <span className="text-slate-500">Сумма для клиента</span>
              <span className="font-semibold">
                {formatCurrency(order.totalPriceClient)}
              </span>
            </li>
          </ul>
        </div>

        <div className="order-details__panel order-details__panel--form rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="order-details__panel-title text-lg font-semibold">
            Управление заказом
          </h2>
          <Separator className="my-4" />
          <OrderStatusForm
            orderId={order.id}
            initialStatus={order.status}
            initialNotes={order.managerNotes ?? ""}
          />
        </div>
      </div>

      <div className="order-details__items rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="order-details__items-title text-lg font-semibold">Позиции</h2>
        <Separator className="my-4" />
        <div className="order-details__table-wrapper overflow-x-auto">
          <Table className="order-details__table min-w-full">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Название</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Ед.</TableHead>
                <TableHead>Цена</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{formatCurrency(item.priceAtMoment)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

