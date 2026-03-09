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

const productInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  images: {
    orderBy: { id: "asc" },
    select: { id: true, url: true }
  }
} as const;

export async function getProductsWithMeta(scope?: SessionScope) {
  return prisma.product.findMany({
    where: ownerFilter(scope),
    include: {
      category: true,
      images: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getProductById(id: string, scope?: SessionScope) {
  return prisma.product.findFirst({
    where: {
      id,
      ...(ownerFilter(scope) ?? {})
    },
    include: {
      category: true,
      images: true
    }
  });
}

export async function getProductsForCatalog(limit = 12) {
  return prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit
  });
}

export async function getProductsByCategorySlug(slug: string) {
  return prisma.product.findMany({
    where: {
      category: { slug }
    },
    include: productInclude,
    orderBy: { createdAt: "desc" }
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude
  });
}
