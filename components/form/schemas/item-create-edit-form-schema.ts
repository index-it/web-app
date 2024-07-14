import { z } from "zod";

export const ItemCreateEditFormSchema = z.object({
  name: z.string().min(1, "Item name must not be empty").max(200, "Item name cannot be longer than 200 characters"),
  color: z.string()
    .length(7)
    .refine((value) => /#[0-9a-fA-F]{6}/.test(value), 'Color must be valid'),
  link: z.string().max(200, "Item link cannot be longer than 200 characters").optional(),
});