"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const statusOptions = [
  { value: "NEW", label: "Новый" },
  { value: "CHECKING", label: "Проверка" },
  { value: "WAITING_CUSTOMER", label: "Ожидание клиента" },
  { value: "CONFIRMED", label: "Подтвержден" },
  { value: "COMPLETED", label: "Завершен" },
  { value: "CANCELED", label: "Отменен" }
] as const;

type OrderStatus = (typeof statusOptions)[number]["value"];

type OrderStatusFormProps = {
  orderId: string;
  initialStatus: OrderStatus;
  initialNotes: string;
};

export function OrderStatusForm({
  orderId,
  initialStatus,
  initialNotes
}: OrderStatusFormProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [managerNotes, setManagerNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, managerNotes })
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить изменения");
      }

      setFeedback("Изменения сохранены");
    } catch (error) {
      console.error(error);
      setFeedback("Ошибка при сохранении. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="order-status-form flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="order-status-form__field flex flex-col gap-2">
        <Label htmlFor="status">Статус</Label>
        <Select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="order-status-form__field flex flex-col gap-2">
        <Label htmlFor="managerNotes">Заметки менеджера</Label>
        <Textarea
          id="managerNotes"
          value={managerNotes}
          onChange={(event) => setManagerNotes(event.target.value)}
          placeholder="Опишите, что обсудили с клиентом..."
        />
      </div>
      {feedback && (
        <p className="order-status-form__feedback text-sm text-slate-600">{feedback}</p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Сохраняем..." : "Сохранить"}
      </Button>
    </form>
  );
}

