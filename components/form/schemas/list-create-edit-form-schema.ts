import { z } from "zod";

export const ListCreateEditFormSchema = z.object({
  name: z.string().min(1, "List name must not be empty").max(100, "List name cannot be longer than 100 characters"),
  icon: z.string().min(1, "Choose a valid icon").max(10, "Choose a valid icon"),
  color: z.string()
    .length(7)
    .refine((value) => /#[0-9a-fA-F]{6}/.test(value), 'Color must be valid'),
  public: z.boolean()
});