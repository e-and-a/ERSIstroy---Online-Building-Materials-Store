import { prisma } from "@/lib/prisma";
import type { AdminRole } from "@/lib/auth/constants";

type SessionScope = {
  role: AdminRole;
  sub: string;
};

function ownerFilter(scope?: SessionScope) {
  if (!scope || scope.role === "admin") {
    return undefined;
  }
  return { createdById: scope.sub };
}

export async function getCategoriesWithMeta(scope?: SessionScope) {
  return prisma.category.findMany({
    where: ownerFilter(scope),
    include: {
      parent: true,
      _count: { select: { products: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getCategoryById(id: string, scope?: SessionScope) {
  const ownerWhere = ownerFilter(scope);

  return prisma.category.findFirst({
    where: {
      id,
      ...(ownerWhere ?? {})
    },
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

export async function getCategoryOptions(excludeId?: string, scope?: SessionScope) {
  const ownerWhere = ownerFilter(scope);

  return prisma.category.findMany({
    where: {
      ...(excludeId
        ? {
            id: { not: excludeId }
          }
        : {}),
      ...(ownerWhere ?? {})
    },
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
