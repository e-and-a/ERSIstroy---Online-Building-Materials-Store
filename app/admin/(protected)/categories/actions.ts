"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { categoryFormSchema } from "@/lib/validators/category";
import type { CategoryFormState } from "@/lib/forms/category";

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    parentId: formData.get("parentId")
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { errors: fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        errors: { slug: ["Такой slug уже используется"] }
      };
    }
    console.error("[createCategoryAction] error", error);
    return { formError: "Не удалось создать категорию. Попробуйте позже." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    parentId: formData.get("parentId")
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { errors: fieldErrors };
  }

  const data = parsed.data;

  if (data.parentId === categoryId) {
    return {
      errors: { parentId: ["Категория не может ссылаться на саму себя"] }
    };
  }

  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        errors: { slug: ["Такой slug уже используется"] }
      };
    }
    console.error("[updateCategoryAction] error", error);
    return { formError: "Не удалось обновить категорию. Попробуйте позже." };
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${categoryId}`);
  return { success: true };
}

export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get("categoryId");
  if (!id || typeof id !== "string") {
    return;
  }

  try {
    await prisma.category.delete({
      where: { id }
    });
  } catch (error) {
    console.error("[deleteCategoryAction] error", error);
    return;
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

