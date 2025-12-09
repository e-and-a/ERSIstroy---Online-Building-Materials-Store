import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите название категории")
    .max(120, "Название слишком длинное"),
  slug: z
    .string()
    .trim()
    .min(2, "Введите slug")
    .max(120, "Slug слишком длинный")
    .regex(/^[a-z0-9-]+$/, "Используйте латиницу, цифры и дефис")
    .transform((value) => value.toLowerCase()),
  parentId: z
    .union([z.string().cuid(), z.literal("")])
    .optional()
    .transform((value) => {
      if (!value || value.length === 0) return null;
      return value;
    })
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

