import { z } from "zod";

const enumValues = {
  contactMethod: ["call", "whatsapp", "telegram", "email"] as const,
  orderType: ["order", "calculation_request"] as const,
  unit: ["piece", "bag", "sqm", "meter", "pack", "pallet"] as const
};

export const orderItemSchema = z.object({
  productId: z.string().min(1).optional(),
  productName: z.string().min(1, "Название товара обязательно"),
  quantity: z.number().int().positive("Количество должно быть больше нуля"),
  priceAtMoment: z.number().nonnegative("Цена не может быть отрицательной"),
  unit: z.enum(enumValues.unit, {
    required_error: "Выберите единицу измерения"
  })
});

export const orderFormSchema = z.object({
  customerName: z.string().min(2, "Введите имя"),
  phone: z.string().min(5, "Введите телефон"),
  email: z.string().email("Введите корректный email"),
  city: z.string().min(2, "Введите город"),
  contactMethod: z.enum(enumValues.contactMethod, {
    required_error: "Выберите способ связи"
  }),
  comment: z.string().max(2000).optional().or(z.literal("")),
  type: z.enum(enumValues.orderType),
  totalPriceClient: z.number().nonnegative().optional(),
  items: z.array(orderItemSchema).min(1, "Добавьте хотя бы один товар")
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;

