"use client";

import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  productFormInitialState,
  type ProductFormState
} from "@/lib/forms/product";

const unitOptions = [
  { value: "piece", label: "Штука" },
  { value: "bag", label: "Мешок" },
  { value: "sqm", label: "м²" },
  { value: "meter", label: "Метр" },
  { value: "pack", label: "Упаковка" },
  { value: "pallet", label: "Палета" }
] as const;

type ProductFormProps = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: { id: string; name: string }[];
  defaultValues?: {
    name: string;
    slug: string;
    description: string | null;
    categoryId: string;
    price: string;
    unit: string;
    weight?: string | null;
    volume?: string | null;
    isAvailable: boolean;
    isOnDemand: boolean;
    images: string;
  };
  submitLabel: string;
};

export function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel
}: ProductFormProps) {
  const [state, formAction] = useFormState(action, productFormInitialState);

  return (
    <form className="product-form flex flex-col gap-6" action={formAction}>
      <div className="product-form__grid grid gap-4 md:grid-cols-2">
        <div className="product-form__field flex flex-col gap-2">
          <Label htmlFor="product-name">Название</Label>
          <Input
            id="product-name"
            name="name"
            placeholder="Например, Кирпич полнотелый"
            defaultValue={defaultValues?.name}
            required
          />
          {state.errors?.name && (
            <p className="product-form__error text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>
        <div className="product-form__field flex flex-col gap-2">
          <Label htmlFor="product-slug">Slug</Label>
          <Input
            id="product-slug"
            name="slug"
            placeholder="kirpich-polnotelyi"
            defaultValue={defaultValues?.slug}
            required
          />
          {state.errors?.slug && (
            <p className="product-form__error text-sm text-red-600">{state.errors.slug[0]}</p>
          )}
        </div>
      </div>

      <div className="product-form__field flex flex-col gap-2">
        <Label htmlFor="product-description">Описание</Label>
        <Textarea
          id="product-description"
          name="description"
          placeholder="Краткое описание товара"
          defaultValue={defaultValues?.description ?? ""}
        />
        {state.errors?.description && (
          <p className="product-form__error text-sm text-red-600">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <div className="product-form__grid grid gap-4 md:grid-cols-2">
        <div className="product-form__field flex flex-col gap-2">
          <Label htmlFor="product-category">Категория</Label>
          <Select
            id="product-category"
            name="categoryId"
            defaultValue={defaultValues?.categoryId ?? ""}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {state.errors?.categoryId && (
            <p className="product-form__error text-sm text-red-600">
              {state.errors.categoryId[0]}
            </p>
          )}
        </div>

        <div className="product-form__field flex flex-col gap-2">
          <Label htmlFor="product-unit">Ед. измерения</Label>
          <Select
            id="product-unit"
            name="unit"
            defaultValue={defaultValues?.unit ?? ""}
            required
          >
            <option value="">Выберите единицу</option>
            {unitOptions.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </Select>
          {state.errors?.unit && (
            <p className="product-form__error text-sm text-red-600">{state.errors.unit[0]}</p>
          )}
        </div>
      </div>

      <div className="product-form__grid grid gap-4 md:grid-cols-3">
        <div className="product-form__field flex flex-col gap-2">
          <Label htmlFor="product-price">Цена, ₽</Label>
          <Input
            id="product-price"
            name="price"
            type="number"
            step="0.01"
            placeholder="0"
            defaultValue={defaultValues?.price}
            required
          />
          {state.errors?.price && (
            <p className="product-form__error text-sm text-red-600">{state.errors.price[0]}</p>
          )}
        </div>
        <div className="product-form__field flex flex-col gap-2">
          <Label htmlFor="product-weight">Вес (кг)</Label>
          <Input
            id="product-weight"
            name="weight"
            type="number"
            step="0.01"
            placeholder="—"
            defaultValue={defaultValues?.weight ?? ""}
          />
          {state.errors?.weight && (
            <p className="product-form__error text-sm text-red-600">{state.errors.weight[0]}</p>
          )}
        </div>
        <div className="product-form__field flex flex-col gap-2">
          <Label htmlFor="product-volume">Объем (м³)</Label>
          <Input
            id="product-volume"
            name="volume"
            type="number"
            step="0.01"
            placeholder="—"
            defaultValue={defaultValues?.volume ?? ""}
          />
          {state.errors?.volume && (
            <p className="product-form__error text-sm text-red-600">{state.errors.volume[0]}</p>
          )}
        </div>
      </div>

      <div className="product-form__field flex flex-col gap-2">
        <Label htmlFor="product-images">Изображения (через запятую)</Label>
        <Input
          id="product-images"
          name="images"
          placeholder="https://example.com/one.jpg, https://example.com/two.jpg"
          defaultValue={defaultValues?.images ?? ""}
        />
        <p className="product-form__hint text-sm text-slate-500">
          Укажите ссылки через запятую. Первое изображение будет основным.
        </p>
        {state.errors?.images && (
          <p className="product-form__error text-sm text-red-600">{state.errors.images[0]}</p>
        )}
      </div>

      <div className="product-form__toggles grid gap-4 md:grid-cols-2">
        <label className="product-form__checkbox flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={defaultValues?.isAvailable ?? true}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
          />
          <div className="flex flex-col text-sm">
            <span className="font-medium">В наличии</span>
            <span className="text-slate-500">Отображать как доступный товар</span>
          </div>
        </label>
        <label className="product-form__checkbox flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <input
            type="checkbox"
            name="isOnDemand"
            defaultChecked={defaultValues?.isOnDemand ?? false}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
          />
          <div className="flex flex-col text-sm">
            <span className="font-medium">Под заказ</span>
            <span className="text-slate-500">Отметьте, если требуется подтверждение наличия</span>
          </div>
        </label>
      </div>

      {state.formError && (
        <p className="product-form__error text-sm text-red-600">{state.formError}</p>
      )}

      {state.success && (
        <p className="product-form__success text-sm text-green-600">
          Изменения сохранены.
        </p>
      )}

      <div className="product-form__actions flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

