import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import { OrderDetails } from "@/components/orders/order-details";

type PageProps = {
  params: { id: string };
};

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <section className="admin-order-details-page mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="admin-order-details-page__header flex flex-col gap-2">
        <p className="admin-order-details-page__meta text-sm text-slate-500">
          ID заказа: {order.id}
        </p>
        <h1 className="admin-order-details-page__title text-3xl font-semibold">
          Детали заказа
        </h1>
      </header>
      <OrderDetails order={order} />
    </section>
  );
}

