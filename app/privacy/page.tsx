const sections = [
  {
    title: "1. Сбор данных",
    body: [
      "Мы собираем контактные данные, которые вы указываете в формах заказа: имя, телефон, email и город доставки.",
      "Дополнительно могут обрабатываться технические данные (IP-адрес, данные браузера) для защиты от мошенничества и улучшения работы сайта."
    ]
  },
  {
    title: "2. Цели обработки",
    body: [
      "Сбор данных необходим для оформления заказов, связи с клиентами и отправки уведомлений о статусе заявки.",
      "Агрегированные анонимные данные могут использоваться для аналитики и улучшения ассортимента."
    ]
  },
  {
    title: "3. Передача третьим лицам",
    body: [
      "Доступ к персональным данным имеют только сотрудники, задействованные в обработке заказов.",
      "Передача данных третьим лицам возможна только для выполнения доставки или по требованию законодательства."
    ]
  },
  {
    title: "4. Права пользователя",
    body: [
      "Вы можете запросить уточнение, обновление или удаление своих персональных данных, направив запрос на официальный email компании.",
      "Используя сайт, вы подтверждаете согласие с условиями политики конфиденциальности."
    ]
  }
] as const;

export default function PrivacyPage() {
  return (
    <section className="legal-page mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 md:px-6">
      <header className="legal-page__header flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
        <p className="legal-page__eyebrow text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          Юридическая информация
        </p>
        <h1 className="legal-page__title text-3xl font-semibold text-gray-900">
          Политика конфиденциальности
        </h1>
        <p className="legal-page__subtitle text-gray-600">
          Описывает порядок обработки персональных данных и меры по их защите.
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
