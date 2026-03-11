import z from "zod/v4";

export const PatientCheckEmailFormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

export const SignUpSchema = z.object({
  email: z.email().min(1, { message: "Please enter your email" }),
  password: z.string().min(6, { message: "Please enter your password" }),
  repeatPassword: z.string().min(6, { message: "Please enter your password" }),
});

export const LoginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

export const PatientSignUpSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  fullName: z.string().min(1, { message: "Please enter full name" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Please enter your phone number" })
    .max(10, { message: "Phone number too long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
