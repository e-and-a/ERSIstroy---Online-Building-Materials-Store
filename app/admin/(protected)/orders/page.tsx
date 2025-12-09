import { OrderStatus, OrderType } from "@prisma/client";
import { getOrders } from "@/lib/data/orders";
import { OrdersFilters } from "@/components/orders/orders-filters";
import { OrdersTable } from "@/components/orders/orders-table";

type SearchParams = {
  status?: string;
  type?: string;
  query?: string;
  page?: string;
};

const statusValues = new Set(Object.values(OrderStatus));
const typeValues = new Set(Object.values(OrderType));

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const status = searchParams.status;
  const type = searchParams.type;

  const parsedStatus = statusValues.has(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined;
  const parsedType = typeValues.has(type as OrderType)
    ? (type as OrderType)
    : undefined;
  const parsedPage = Number(searchParams.page) || 1;
  const search = searchParams.query?.toString();

  const ordersData = await getOrders({
    status: parsedStatus,
    type: parsedType,
    search,
    page: parsedPage
  });

  return (
    <section className="admin-orders-page mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="admin-orders-page__header flex flex-col gap-2">
        <h1 className="admin-orders-page__title text-3xl font-semibold">
          Заявки клиентов
        </h1>
        <p className="admin-orders-page__subtitle text-slate-600">
          Управляйте заявками, отслеживайте статусы и обновляйте заметки менеджеров.
        </p>
      </div>

      <OrdersFilters
        initialStatus={parsedStatus ?? ""}
        initialType={parsedType ?? ""}
        initialSearch={search ?? ""}
      />

      <OrdersTable
        orders={ordersData.items}
        total={ordersData.total}
        page={ordersData.page}
        pageSize={ordersData.pageSize}
      />
    </section>
  );
}

