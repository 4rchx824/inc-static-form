import { z } from "zod";

export const staticForm = z.object({
  Question1: z
    .string({
      required_error: "Field is required.",
    })
    .min(1, {
      message: "Field cannot be empty",
    }),

  Question2: z
    .string({
      required_error: "Password is required.",
    })
    .min(4, {
      message: "Password must be at least 4 characters.",
    }),

  Question3: z.string(),
  Question4: z.enum(["Option 1", "Option 2", "Option 3"]),
  Question5: z.enum(["Option 1", "Option 2", "Option 3"]),
  Question6: z.coerce.date(),

  Question7: z.boolean(),
});
