import Link from "next/link";
import { getCategoriesForCatalog } from "@/lib/data/categories";
import { getProductsForCatalog } from "@/lib/data/products";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";

const advantages = [
  {
    title: "Доставка по региону",
    description: "Работаем с проверенными перевозчиками и доставляем заказы точно в срок."
  },
  {
    title: "Оптовые цены",
    description: "Предоставляем выгодные условия и персональные расчеты для крупных объёмов."
  },
  {
    title: "Большой ассортимент",
    description: "Сотни позиций стройматериалов на складе и под заказ."
  },
  {
    title: "Поддержка менеджера",
    description: "Поможем подобрать материалы, подготовим смету и ответим на вопросы."
  }
] as const;

function formatPlural(count: number, forms: [string, string, string]) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCategoriesForCatalog>> = [];
  let products: Awaited<ReturnType<typeof getProductsForCatalog>> = [];

  try {
    [categories, products] = await Promise.all([
      getCategoriesForCatalog(),
      getProductsForCatalog(8),
    ]);
  } catch (error) {
    console.error("DB not available, showing empty catalog", error);
  }

  const highlightedCategories = categories.slice(0, 6);

  return (
    <div className="home-page mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 md:px-6">
      <section className="hero grid gap-8 rounded-2xl border border-gray-200 bg-white px-6 py-10 md:grid-cols-2 md:px-10">
        <div className="hero__content flex flex-col gap-5">
          <p className="hero__eyebrow text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
            ERSI Stroy
          </p>
          <h1 className="hero__title text-4xl font-semibold leading-tight text-gray-900 md:text-5xl">
            Стройматериалы с доставкой и быстрым расчётом
          </h1>
          <p className="hero__subtitle text-lg text-gray-600">
            Собираем и доставляем заказы по региону. Добавьте товары в корзину или оставьте заявку —
            менеджер свяжется и уточнит детали.
          </p>
          <div className="hero__actions flex flex-wrap gap-3">
            <Link href="/catalog" className="hero__cta">
              <Button size="lg" className="bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700">
                Перейти в каталог
              </Button>
            </Link>
            <Link href="/order" className="hero__cta-secondary">
              <Button
                size="lg"
                variant="outline"
                className="border-brand-300 bg-white text-gray-900 hover:bg-brand-50 active:bg-brand-100"
              >
                Оформить заявку
              </Button>
            </Link>
          </div>
          <div className="hero__stats grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="hero__stat rounded-lg border border-gray-200 bg-white px-3 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-500">категорий</p>
            </div>
            <div className="hero__stat rounded-lg border border-gray-200 bg-white px-3 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <p className="text-sm text-gray-500">товаров</p>
            </div>
            <div className="hero__stat rounded-lg border border-gray-200 bg-white px-3 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">24/7</p>
              <p className="text-sm text-gray-500">приём заявок</p>
            </div>
            <div className="hero__stat rounded-lg border border-gray-200 bg-white px-3 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">100+</p>
              <p className="text-sm text-gray-500">поставщиков</p>
            </div>
          </div>
        </div>

        <div className="hero__visual flex items-center">
          <div className="w-full space-y-4 rounded-xl border border-brand-100 bg-brand-50/60 px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">Как оформить заказ</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. Добавьте товары в корзину или выберите «Оформить заявку».</li>
              <li>2. Получите расчет стоимости и подтверждение наличия.</li>
              <li>3. Согласуйте доставку и получите материалы в срок.</li>
            </ol>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-brand-100 bg-white px-4 py-3">
                <p className="font-semibold text-gray-900">Поддержка</p>
                <p className="text-gray-500">Помогаем подобрать аналоги</p>
              </div>
              <div className="rounded-lg border border-brand-100 bg-white px-4 py-3">
                <p className="font-semibold text-gray-900">Цены</p>
                <p className="text-gray-500">Оптовые условия под объём</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-categories flex flex-col gap-4">
        <header className="home-section__header flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="home-section__eyebrow text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              Категории
            </p>
            <h2 className="home-section__title text-3xl font-semibold text-gray-900">
              Основные направления
            </h2>
          </div>
          <Link
            href="/catalog"
            className="home-section__link text-sm font-semibold text-brand-700 hover:text-brand-600"
          >
            Весь каталог →
          </Link>
        </header>

        {highlightedCategories.length > 0 ? (
          <div className="home-categories__grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlightedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog/${category.slug}`}
                className="category-card group flex flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:border-gray-300"
              >
                <div className="category-card__image mb-4 flex h-24 items-center justify-center rounded-md bg-brand-50 text-4xl text-brand-600">
                  🧱
                </div>
                <h3 className="category-card__title text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                <p className="category-card__meta mt-2 text-sm text-gray-500">
                  {category._count.products}{" "}
                  {formatPlural(category._count.products, ["товар", "товара", "товаров"])}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="category-card__empty rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            Категории появятся здесь сразу после добавления в админ-панели.
          </div>
        )}
      </section>

      <section className="home-section home-products flex flex-col gap-4">
        <header className="home-section__header flex flex-col gap-2">
          <p className="home-section__eyebrow text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Популярное
          </p>
          <h2 className="home-section__title text-3xl font-semibold text-gray-900">
            Топовые товары недели
          </h2>
        </header>

        {products.length > 0 ? (
          <div className="home-products__grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="home-products__empty rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            Пока нет опубликованных товаров. Добавьте позиции через админ-панель.
          </div>
        )}
      </section>

      <section className="info-block">
        <div className="info-block__grid grid gap-4 md:grid-cols-2">
          {advantages.map((advantage) => (
            <article
              key={advantage.title}
              className="info-block__item flex gap-4 rounded-lg border border-gray-200 bg-white p-5"
            >
              <div className="info-block__icon h-12 w-12 flex-shrink-0 rounded-md bg-brand-50 text-xl text-brand-700 ring-1 ring-brand-100">
                <span className="flex h-full w-full items-center justify-center">★</span>
              </div>
              <div>
                <h3 className="info-block__title mb-1 text-lg font-semibold text-gray-900">
                  {advantage.title}
                </h3>
                <p className="info-block__description text-sm text-gray-600">
                  {advantage.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
