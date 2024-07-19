import { z } from "zod";

export const ItemEditFormSchema = z.object({
  list_id: z.string(),
  item_id: z.string(),
  name: z.string().min(1, "Item name must not be empty").max(200, "Item name cannot be longer than 200 characters"),
  category_id: z.string().optional().nullable(),
  link: z.string().max(200, "Item link cannot be longer than 200 characters").optional().nullable(),
});