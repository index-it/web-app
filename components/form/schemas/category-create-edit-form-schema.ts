import { z } from "zod";

export const CategoryCreateEditFormSchema = z.object({
  name: z.string().min(1, "Category name must not be empty").max(100, "Category name cannot be longer than 100 characters"),
  color: z.string()
    .length(7)
    .refine((value) => /#[0-9a-fA-F]{6}/.test(value), 'Color must be valid'),
});