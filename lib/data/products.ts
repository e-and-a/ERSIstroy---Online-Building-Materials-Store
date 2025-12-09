import { prisma } from "@/lib/prisma";

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

export async function getProductsWithMeta() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
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

