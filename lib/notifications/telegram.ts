import { OrderWithItems } from "./types";

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (value && typeof value === "object" && "toNumber" in value && typeof value.toNumber === "function") {
    try {
      return value.toNumber();
    } catch {
      return 0;
    }
  }
  return 0;
}

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(toNumber(value));
}

export async function notifyTelegram(order: OrderWithItems) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const total = order.totalPriceClient ? formatCurrency(order.totalPriceClient) : "—";
  const itemLines = order.items.map((item, index) => {
    const price = formatCurrency(item.priceAtMoment);
    const sum = formatCurrency(item.quantity * toNumber(item.priceAtMoment));
    return `${index + 1}) ${item.productName} — ${item.quantity} ${item.unit} × ${price} = ${sum}`;
  });

  const lines = [
    `Новый заказ #${order.id}`,
    `Имя: ${order.customerName}`,
    `Телефон: ${order.phone}`,
    `Город: ${order.city}`,
    `Тип заявки: ${order.type}`,
    `Итого: ${total}`,
    "",
    "Товары:",
    ...itemLines
  ];

  const message = lines.join("\n");
  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "unknown error");
      console.error("[notifications/telegram] send error", errorText);
    }
  } catch (error) {
    console.error("[notifications/telegram] send error", error);
  }
}

