import z from "zod/v4";

export const SignUpSchema = z.object({
  email: z.email().min(1, { message: "Please enter your email" }),
  password: z.string().min(6, { message: "Please enter your password" }),
  repeatPassword: z.string().min(6, { message: "Please enter your password" }),
});
