import { OrderStatus, OrderType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

export type OrdersQueryParams = {
  status?: OrderStatus;
  type?: OrderType;
  search?: string;
  page?: number;
};

export async function getOrders(params: OrdersQueryParams = {}) {
  const { status, type, search, page = 1 } = params;

  const where: Prisma.OrderWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { email: { contains: search, mode: Prisma.QueryMode.insensitive } }
    ];
  }

  const skip = Math.max(page - 1, 0) * PAGE_SIZE;

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
      skip,
      take: PAGE_SIZE
    }),
    prisma.order.count({ where })
  ]);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE
  };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true }
  });
}

