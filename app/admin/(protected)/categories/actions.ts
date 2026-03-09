"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { categoryFormSchema } from "@/lib/validators/category";
import type { CategoryFormState } from "@/lib/forms/category";
import { getServerSession } from "@/lib/auth/server-session";

async function getAuthSession() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  return session;
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const session = await getAuthSession();
  if (!session) {
    return { formError: "Сессия истекла. Выполните вход снова." };
  }

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
    if (session.role === "user" && data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
        select: { id: true, createdById: true }
      });

      if (!parent || parent.createdById !== session.sub) {
        return { errors: { parentId: ["Можно выбрать только свою категорию."] } };
      }
    }

    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId,
        createdById: session.sub
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
  const session = await getAuthSession();
  if (!session) {
    return { formError: "Сессия истекла. Выполните вход снова." };
  }

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
    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, createdById: true }
    });

    if (!existing) {
      return { formError: "Категория не найдена." };
    }

    if (session.role === "user" && existing.createdById !== session.sub) {
      return { formError: "Недостаточно прав для изменения этой категории." };
    }

    if (session.role === "user" && data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
        select: { id: true, createdById: true }
      });

      if (!parent || parent.createdById !== session.sub) {
        return { errors: { parentId: ["Можно выбрать только свою категорию."] } };
      }
    }

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
  const session = await getAuthSession();
  if (!session) {
    return;
  }

  const id = formData.get("categoryId");
  if (!id || typeof id !== "string") {
    return;
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { id },
      select: { id: true, createdById: true }
    });

    if (!existing) {
      return;
    }

    if (session.role === "user" && existing.createdById !== session.sub) {
      return;
    }

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
