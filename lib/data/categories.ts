import { prisma } from "@/lib/prisma";

export async function getCategoriesWithMeta() {
  return prisma.category.findMany({
    include: {
      parent: true,
      _count: { select: { products: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      _count: { select: { products: true } }
    }
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug }
  });
}

export async function getCategoryOptions(excludeId?: string) {
  return prisma.category.findMany({
    where: excludeId
      ? {
          id: { not: excludeId }
        }
      : undefined,
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true }
  });
}

export async function getCategoriesForCatalog() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { products: true } }
    }
  });
}

