const sections = [
  {
    title: "1. Общие положения",
    body: [
      "Настоящее пользовательское соглашение (далее — Соглашение) регулирует порядок использования сайта ERSI Stroy. Посещая сайт, вы подтверждаете полное согласие с условиями Соглашения.",
      "Компания оставляет за собой право обновлять документ в любое время. Актуальная версия всегда доступна на этой странице."
    ]
  },
  {
    title: "2. Оформление заказов",
    body: [
      "Все сведения о товарах носят информационный характер и не являются публичной офертой. Подтверждение заказа осуществляется менеджером после проверки наличия и цены.",
      "Клиент обязуется предоставить достоверные данные для связи и доставки. Компания может запросить дополнительные документы для подтверждения личности или оплаты."
    ]
  },
  {
    title: "3. Оплата и возвраты",
    body: [
      "Оплата производится по счёту, выставленному менеджером. Стоимость включает НДС, если иное не указано в счёте.",
      "Возврат товара возможен в соответствии с законодательством РФ при сохранении товарного вида и потребительских свойств."
    ]
  },
  {
    title: "4. Ответственность сторон",
    body: [
      "Компания не несёт ответственность за задержки доставки, вызванные действиями перевозчиков или обстоятельствами непреодолимой силы.",
      "Пользователь обязуется не нарушать работоспособность сайта и не размещать материалы, противоречащие законодательству."
    ]
  }
] as const;

export default function TermsPage() {
  return (
    <section className="legal-page mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 md:px-6">
      <header className="legal-page__header flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
        <p className="legal-page__eyebrow text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          Юридическая информация
        </p>
        <h1 className="legal-page__title text-3xl font-semibold text-gray-900">
          Пользовательское соглашение
        </h1>
        <p className="legal-page__subtitle text-gray-600">
          Документ описывает правила использования сайта, порядок оформления заказов и ответственность сторон.
        </p>
      </header>

      <div className="legal-page__content space-y-8 rounded-xl border border-gray-200 bg-white p-8">
        {sections.map((section) => (
          <article key={section.title} className="legal-page__section space-y-3">
            <h2 className="legal-page__section-title text-2xl font-semibold text-gray-900">
              {section.title}
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="legal-page__text text-sm leading-relaxed text-gray-600">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
