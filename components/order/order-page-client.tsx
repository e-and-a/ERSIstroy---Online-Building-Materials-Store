"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/use-cart";

const contactMethods = [
  { value: "call", label: "Звонок" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "email", label: "Email" }
] as const;

const orderTypes = [
  { value: "order", label: "Заказ" },
  { value: "calculation_request", label: "Запрос расчета" }
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

export function OrderPageClient() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isCartEmpty = items.length === 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCartEmpty || isSubmitting) return;

    const formData = new FormData(event.currentTarget);

    const payload = {
      customerName: (formData.get("customerName") as string) ?? "",
      phone: (formData.get("phone") as string) ?? "",
      email: (formData.get("email") as string) ?? "",
      city: (formData.get("city") as string) ?? "",
      contactMethod: (formData.get("contactMethod") as string) ?? "call",
      comment: (formData.get("comment") as string) ?? "",
      type: (formData.get("type") as string) ?? "order",
      totalPriceClient: totalAmount,
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        priceAtMoment: item.price,
        unit: item.unit
      }))
    };

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Не удалось отправить заявку. Попробуйте позже.");
      }

      clearCart();
      router.push("/thanks");
    } catch (error) {
      console.error("[order] submit error", error);
      setFeedback(
        error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте позже."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="order-page mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <header className="order-page__header flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="order-page__title text-4xl font-semibold text-gray-900">
          Оформление заявки
        </h1>
        <p className="order-page__notice text-sm text-gray-500">
          Информация не является публичной офертой. Окончательная стоимость и наличие уточняются
          менеджером.
        </p>
      </header>

      <form className="order-form flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="order-form__grid grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="order-form__fields space-y-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="order-form__field-group grid gap-4 md:grid-cols-2">
              <div className="order-form__field flex flex-col gap-2">
                <Label htmlFor="customerName">Имя</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              <div className="order-form__field flex flex-col gap-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  required
                />
              </div>
            </div>

            <div className="order-form__field-group grid gap-4 md:grid-cols-2">
              <div className="order-form__field flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.ru"
                  required
                />
              </div>
              <div className="order-form__field flex flex-col gap-2">
                <Label htmlFor="city">Город</Label>
                <Input id="city" name="city" placeholder="Москва" required />
              </div>
            </div>

            <div className="order-form__field-group grid gap-4 md:grid-cols-2">
              <div className="order-form__field flex flex-col gap-2">
                <Label htmlFor="contactMethod">Способ связи</Label>
                <Select
                  id="contactMethod"
                  name="contactMethod"
                  defaultValue={contactMethods[0].value}
                  required
                >
                  {contactMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="order-form__field flex flex-col gap-2">
                <Label htmlFor="type">Тип заявки</Label>
                <Select id="type" name="type" defaultValue={orderTypes[0].value} required>
                  {orderTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="order-form__field flex flex-col gap-2">
              <Label htmlFor="comment">Комментарий</Label>
              <Textarea
                id="comment"
                name="comment"
                rows={4}
                placeholder="Опишите задачу, укажите желаемые сроки и адрес поставки."
              />
              <p className="order-form__hint text-xs text-gray-500">
                Менеджер свяжется с вами для уточнения деталей.
              </p>
            </div>

            <div className="order-form__info rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Как работает заявка?</p>
              <p className="mt-1">
                Отправьте форму, менеджер проверит наличие, рассчитает доставку и вернется с
                подтверждением.
              </p>
            </div>

            <p className="order-form__footnote text-sm text-gray-500">
              Отправляя заявку, вы соглашаетесь с{" "}
              <Link href="/privacy" className="underline">
                политикой конфиденциальности
              </Link>
              .
            </p>
          </div>

          <div className="order-cart flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-28">
            <div className="order-cart__header flex items-center justify-between">
              <h2 className="order-cart__title text-2xl font-semibold text-gray-900">
                Корзина
              </h2>
              <span className="order-cart__count text-sm text-gray-500">
                {items.length} позиций
              </span>
            </div>

            {isCartEmpty ? (
              <div className="order-cart__empty rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Корзина пуста.{" "}
                <Link href="/catalog" className="font-medium text-gray-900 underline">
                  Перейти в каталог
                </Link>
                .
              </div>
            ) : (
              <>
                <ul className="order-cart__list flex flex-col gap-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="order-cart__item flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="order-cart__item-name text-base font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="order-cart__item-meta text-sm text-gray-500">
                          {formatCurrency(item.price)} / {item.unit} × {item.quantity}
                        </p>
                      </div>
                      <p className="order-cart__item-sum text-lg font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="order-cart__total flex items-center justify-between rounded-lg bg-gray-50 p-4 text-lg font-semibold">
                  <span>Итого</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="order-cart__submit w-full bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700"
              disabled={isCartEmpty || isSubmitting}
            >
              {isCartEmpty ? "Добавьте товары" : isSubmitting ? "Отправляем..." : "Отправить заявку"}
            </Button>

            {feedback && (
              <p className="order-cart__feedback text-sm text-red-600">{feedback}</p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
