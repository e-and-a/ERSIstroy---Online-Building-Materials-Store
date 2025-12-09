"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FormEvent, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const statusOptions = [
  { value: "", label: "Все статусы" },
  { value: "NEW", label: "Новые" },
  { value: "CHECKING", label: "Проверка" },
  { value: "WAITING_CUSTOMER", label: "Ожидание клиента" },
  { value: "CONFIRMED", label: "Подтвержденные" },
  { value: "COMPLETED", label: "Завершенные" },
  { value: "CANCELED", label: "Отмененные" }
];

const typeOptions = [
  { value: "", label: "Все типы" },
  { value: "order", label: "Заказ" },
  { value: "calculation_request", label: "Расчет" }
];

type OrdersFiltersProps = {
  initialStatus?: string;
  initialType?: string;
  initialSearch?: string;
};

export function OrdersFilters({
  initialStatus = "",
  initialType = "",
  initialSearch = ""
}: OrdersFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    const status = (formData.get("status") as string) ?? "";
    const type = (formData.get("type") as string) ?? "";
    const query = (formData.get("query") as string) ?? "";

    status ? params.set("status", status) : params.delete("status");
    type ? params.set("type", type) : params.delete("type");
    query ? params.set("query", query) : params.delete("query");
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleReset() {
    startTransition(() => {
      router.replace(pathname);
    });
  }

  return (
    <form
      className="orders-filters grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"
      onSubmit={handleSubmit}
    >
      <div className="orders-filters__field md:col-span-2">
        <label className="orders-filters__label mb-1 block text-sm font-medium text-slate-700">
          Поиск
        </label>
        <Input
          name="query"
          placeholder="Имя, телефон или email"
          defaultValue={initialSearch}
        />
      </div>
      <div className="orders-filters__field">
        <label className="orders-filters__label mb-1 block text-sm font-medium text-slate-700">
          Статус
        </label>
        <Select name="status" defaultValue={initialStatus}>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="orders-filters__field">
        <label className="orders-filters__label mb-1 block text-sm font-medium text-slate-700">
          Тип заявки
        </label>
        <Select name="type" defaultValue={initialType}>
          {typeOptions.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="orders-filters__actions flex flex-col gap-3 md:col-span-4 md:flex-row md:justify-end">
        <Button
          type="submit"
          className="orders-filters__submit md:w-auto"
          disabled={isPending}
        >
          Применить
        </Button>
        <Button
          type="button"
          variant="outline"
          className="orders-filters__reset md:w-auto"
          onClick={handleReset}
          disabled={isPending}
        >
          Сбросить
        </Button>
      </div>
    </form>
  );
}

