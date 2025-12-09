import { z } from "zod";

const decimalString = z
  .string()
  .trim()
  .refine((value) => value === "" || !Number.isNaN(Number(value)), "Введите число");

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите название товара")
    .max(200, "Название слишком длинное"),
  slug: z
    .string()
    .trim()
    .min(2, "Введите slug")
    .max(160, "Slug слишком длинный")
    .regex(/^[a-z0-9-]+$/, "Используйте латиницу, цифры и дефис")
    .transform((value) => value.toLowerCase()),
  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  categoryId: z.string().cuid("Выберите категорию"),
  price: decimalString.refine((value) => value !== "", "Введите цену"),
  unit: z.enum(["piece", "bag", "sqm", "meter", "pack", "pallet"], {
    required_error: "Выберите единицу измерения"
  }),
  weight: decimalString.optional(),
  volume: decimalString.optional(),
  isAvailable: z.preprocess((value) => value === "on", z.boolean()),
  isOnDemand: z.preprocess((value) => value === "on", z.boolean()),
  images: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

