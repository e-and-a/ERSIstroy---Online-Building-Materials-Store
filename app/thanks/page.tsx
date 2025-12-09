import Link from "next/link";

export default function ThanksPage() {
  return (
    <section className="thanks-page mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="thanks-page__card w-full rounded-xl border border-gray-200 bg-white px-8 py-12">
        <div className="thanks-page__icon mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-700">
          ✅
        </div>
        <p className="thanks-page__eyebrow text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">
          Успешно
        </p>
        <h1 className="thanks-page__title mt-2 text-3xl font-semibold text-gray-900">
          Спасибо! Ваша заявка отправлена.
        </h1>
        <p className="thanks-page__subtitle mt-4 text-lg text-gray-600">
          Менеджер свяжется с вами в ближайшее время, уточнит детали заказа и поможет с оплатой.
        </p>
        <div className="thanks-page__actions mt-8 flex flex-col items-center gap-3">
          <Link href="/catalog" className="thanks-page__cta inline-flex items-center justify-center">
            <span className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 active:bg-brand-700">
              Вернуться в каталог
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
