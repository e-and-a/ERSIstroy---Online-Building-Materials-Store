"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { productFormSchema } from "@/lib/validators/product";
import {
  parseProductImages,
  type ProductFormState
} from "@/lib/forms/product";

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    unit: formData.get("unit"),
    weight: formData.get("weight"),
    volume: formData.get("volume"),
    isAvailable: formData.get("isAvailable"),
    isOnDemand: formData.get("isOnDemand"),
    images: formData.get("images")
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { errors: fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        price: new Prisma.Decimal(data.price),
        unit: data.unit,
        weight: data.weight ? new Prisma.Decimal(data.weight) : null,
        volume: data.volume ? new Prisma.Decimal(data.volume) : null,
        isAvailable: data.isAvailable,
        isOnDemand: data.isOnDemand,
        images: {
          create: parseProductImages(data.images).map((url) => ({ url }))
        }
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        errors: { slug: ["Такой slug уже используется"] }
      };
    }
    console.error("[createProductAction] error", error);
    return { formError: "Не удалось создать товар. Попробуйте позже." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    unit: formData.get("unit"),
    weight: formData.get("weight"),
    volume: formData.get("volume"),
    isAvailable: formData.get("isAvailable"),
    isOnDemand: formData.get("isOnDemand"),
    images: formData.get("images")
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { errors: fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        price: new Prisma.Decimal(data.price),
        unit: data.unit,
        weight: data.weight ? new Prisma.Decimal(data.weight) : null,
        volume: data.volume ? new Prisma.Decimal(data.volume) : null,
        isAvailable: data.isAvailable,
        isOnDemand: data.isOnDemand,
        images: {
          deleteMany: {},
          create: parseProductImages(data.images).map((url) => ({ url }))
        }
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        errors: { slug: ["Такой slug уже используется"] }
      };
    }
    console.error("[updateProductAction] error", error);
    return { formError: "Не удалось обновить товар. Попробуйте позже." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}

export async function deleteProductAction(formData: FormData) {
  const productId = formData.get("productId");
  if (!productId || typeof productId !== "string") {
    return;
  }

  try {
    await prisma.product.delete({
      where: { id: productId }
    });
  } catch (error) {
    console.error("[deleteProductAction] error", error);
    return;
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

