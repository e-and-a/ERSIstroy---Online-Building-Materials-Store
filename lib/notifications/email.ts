import nodemailer from "nodemailer";
import { OrderWithItems } from "./types";

type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  to: string;
};

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

function getEmailConfig(): EmailConfig | null {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const to = process.env.EMAIL_TO;

  if (!host || !port || !user || !pass || !to) {
    return null;
  }

  return { host, port, user, pass, to };
}

function buildEmailBody(order: OrderWithItems) {
  const total = order.totalPriceClient ? formatCurrency(order.totalPriceClient) : "—";
  const itemsText = order.items
    .map((item, index) => {
      const price = formatCurrency(item.priceAtMoment);
      const sum = formatCurrency(item.quantity * toNumber(item.priceAtMoment));
      return `${index + 1}) ${item.productName} — ${item.quantity} ${item.unit} × ${price} = ${sum}`;
    })
    .join("\n");

  const text = [
    `Новый заказ #${order.id}`,
    `Имя: ${order.customerName}`,
    `Телефон: ${order.phone}`,
    `Email: ${order.email}`,
    `Город: ${order.city}`,
    `Тип заявки: ${order.type}`,
    `Итого: ${total}`,
    "",
    "Товары:",
    itemsText
  ].join("\n");

  const htmlItems = order.items
    .map((item, index) => {
      const price = formatCurrency(item.priceAtMoment);
      const sum = formatCurrency(item.quantity * toNumber(item.priceAtMoment));
      return `<li>${index + 1}) <strong>${item.productName}</strong> — ${item.quantity} ${item.unit} × ${price} = ${sum}</li>`;
    })
    .join("");

  const html = `
    <h2>Новый заказ #${order.id}</h2>
    <p><strong>Имя:</strong> ${order.customerName}<br/>
    <strong>Телефон:</strong> ${order.phone}<br/>
    <strong>Email:</strong> ${order.email}<br/>
    <strong>Город:</strong> ${order.city}<br/>
    <strong>Тип заявки:</strong> ${order.type}<br/>
    <strong>Итого:</strong> ${total}</p>
    <h3>Товары</h3>
    <ul>${htmlItems}</ul>
    ${order.comment ? `<p><strong>Комментарий клиента:</strong> ${order.comment}</p>` : ""}
  `;

  return { text, html };
}

export async function notifyEmail(order: OrderWithItems) {
  const config = getEmailConfig();
  if (!config) {
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });

    const { text, html } = buildEmailBody(order);

    await transporter.sendMail({
      from: `"ERSI Строй" <${config.user}>`,
      to: config.to,
      subject: `Новый заказ #${order.id}`,
      text,
      html
    });
  } catch (error) {
    console.error("[notifications/email] send error", error);
  }
}

