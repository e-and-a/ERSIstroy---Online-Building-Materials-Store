import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { orderFormSchema } from "@/lib/validators/order";
import { notifyEmail } from "@/lib/notifications/email";
import { notifyTelegram } from "@/lib/notifications/telegram";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = orderFormSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, totalPriceClient, comment, ...orderData } = parsed.data;

    const createdOrder = await prisma.order.create({
      data: {
        ...orderData,
        comment: comment || null,
        totalPriceClient: totalPriceClient
          ? new Prisma.Decimal(totalPriceClient)
          : null,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unit: item.unit,
            priceAtMoment: new Prisma.Decimal(item.priceAtMoment)
          }))
        }
      },
      include: { items: true }
    });

    await Promise.allSettled([notifyEmail(createdOrder), notifyTelegram(createdOrder)]);

    return NextResponse.json({ success: true, orderId: createdOrder.id });
  } catch (error) {
    console.error("[api/orders] POST error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Не удалось создать заказ. Попробуйте позже."
      },
      { status: 500 }
    );
  }
}

