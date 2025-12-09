"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

export function CartPageClient() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const hasItems = items.length > 0;

  return (
    <section className="cart-page mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <header className="cart-page__header flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="cart-page__title text-3xl font-semibold text-gray-900">
          Корзина
        </h1>
        <p className="cart-page__notice text-sm text-gray-500">
          Информация не является публичной офертой. Окончательная стоимость и наличие уточняются
          менеджером.
        </p>
      </header>

      {hasItems ? (
        <>
          <div className="cart-page__actions flex flex-wrap items-center gap-3 px-1">
            <Button
              variant="outline"
              onClick={clearCart}
              className="rounded-full border-gray-200 text-gray-900 hover:border-brand-300 hover:bg-brand-50"
            >
              Очистить корзину
            </Button>
            <Link
              href="/catalog"
              className="cart-page__continue text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Продолжить покупки
            </Link>
          </div>

          <div className="cart-page__content grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <ul className="cart-page__list space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="cart-item flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="cart-item__image-wrapper h-24 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-28">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item__image h-full w-full object-cover"
                      />
                    ) : (
                      <div className="cart-item__image-placeholder flex h-full w-full items-center justify-center text-xs text-slate-400">
                        Нет фото
                      </div>
                    )}
                  </div>

                  <div className="cart-item__body flex flex-1 flex-col gap-3">
                    <div className="cart-item__info">
                      <p className="cart-item__title text-lg font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="cart-item__price text-sm text-gray-600">
                        {formatCurrency(item.price)}
                        <span className="cart-item__unit ml-2 text-xs uppercase text-gray-500">
                          / {item.unit}
                        </span>
                      </p>
                    </div>

                    <div className="cart-item__controls flex flex-wrap items-center gap-3">
                      <label className="cart-item__quantity flex items-center gap-2 text-sm text-gray-600">
                        Количество:
                        <Input
                          type="number"
                          min={1}
                          className="cart-item__quantity-input h-9 w-24"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.id, Math.max(1, Number(event.target.value) || 1))
                          }
                        />
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        className="cart-item__remove text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>

                  <div className="cart-item__subtotal text-right text-lg font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <aside className="cart-summary h-fit rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="cart-summary__title mb-4 text-2xl font-semibold text-gray-900">
                Итого
              </h2>
              <div className="cart-summary__row flex justify-between text-lg text-gray-900">
                <span>Сумма</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
              <p className="cart-summary__hint mt-2 text-sm text-gray-500">
                Стоимость уточняется менеджером после оформления заявки.
              </p>
              <Link href="/order" className="cart-summary__checkout mt-6 block">
                <Button className="w-full bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700">
                  Оформить заказ
                </Button>
              </Link>
            </aside>
          </div>
        </>
      ) : (
        <div className="cart-page__empty rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          Корзина пуста. Начните с просмотра{" "}
          <Link href="/catalog" className="text-gray-900 underline">
            каталога
          </Link>
          .
        </div>
      )}
    </section>
  );
}
