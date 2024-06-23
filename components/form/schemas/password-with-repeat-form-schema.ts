import { z } from "zod";

export const PasswordWithRepeatFormSchema = z.object({
  password: z.string()
    .min(8, 'Password must contain at least 8 characters')
    .max(100)
    .refine((value) => /[A-Z]/.test(value), 'Password needs at least an uppercase character, a lowercase one and a number')
    .refine((value) => /[a-z]/.test(value), 'Password needs at least an uppercase character, a lowercase one and a number')
    .refine((value) => /\d/.test(value), 'Password needs at least an uppercase character, a lowercase one and a number'),
  repeatPassword: z.string()
}).refine(data => data.password === data.repeatPassword, {
  message: "The passwords must match",
  path: ["repeatPassword"]
});