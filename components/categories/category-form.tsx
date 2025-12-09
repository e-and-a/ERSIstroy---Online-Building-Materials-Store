"use client";

import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  categoryFormInitialState,
  type CategoryFormState
} from "@/lib/forms/category";

type CategoryFormProps = {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  categories: { id: string; name: string }[];
  defaultValues?: {
    name: string;
    slug: string;
    parentId: string | null;
  };
  submitLabel: string;
};

export function CategoryForm({
  action,
  categories,
  defaultValues,
  submitLabel
}: CategoryFormProps) {
  const [state, formAction] = useFormState(action, categoryFormInitialState);

  return (
    <form className="category-form flex flex-col gap-6" action={formAction}>
      <div className="category-form__grid grid gap-4 md:grid-cols-2">
        <div className="category-form__field flex flex-col gap-2">
          <Label htmlFor="category-name">Название</Label>
          <Input
            id="category-name"
            name="name"
            placeholder="Например, Сухие смеси"
            defaultValue={defaultValues?.name}
          />
          {state.errors?.name && (
            <p className="category-form__error text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>
        <div className="category-form__field flex flex-col gap-2">
          <Label htmlFor="category-slug">Slug</Label>
          <Input
            id="category-slug"
            name="slug"
            placeholder="sukhie-smesi"
            defaultValue={defaultValues?.slug}
          />
          {state.errors?.slug && (
            <p className="category-form__error text-sm text-red-600">{state.errors.slug[0]}</p>
          )}
        </div>
      </div>

      <div className="category-form__field flex flex-col gap-2">
        <Label htmlFor="category-parent">Родитель</Label>
        <Select
          id="category-parent"
          name="parentId"
          defaultValue={defaultValues?.parentId ?? ""}
        >
          <option value="">— Без родителя</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {state.errors?.parentId && (
          <p className="category-form__error text-sm text-red-600">
            {state.errors.parentId[0]}
          </p>
        )}
      </div>

      {state.formError && (
        <p className="category-form__error text-sm text-red-600">{state.formError}</p>
      )}

      {state.success && (
        <p className="category-form__success text-sm text-green-600">
          Изменения сохранены.
        </p>
      )}

      <div className="category-form__actions flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

