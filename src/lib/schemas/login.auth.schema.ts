import * as z from "zod/v4";

export const LoginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});
