import * as z from "zod";

export const ProviderEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

export const ProviderLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

export const ProviderSignUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  title: z.string().min(1, { message: "Please select your title" }),
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Please enter your full name" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type ProviderEmailFormData = z.infer<typeof ProviderEmailSchema>;
export type ProviderLoginFormData = z.infer<typeof ProviderLoginSchema>;
export type ProviderSignUpFormData = z.infer<typeof ProviderSignUpSchema>;

export const ProviderPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ProviderPasswordFormData = z.infer<typeof ProviderPasswordSchema>;

export const ProviderProfilePhotoStepSchema = z.object({
  photo: z
    .string()
    .nullable()
    .refine((value): value is string => !!value && value.length > 0, {
      message: "Please upload a photo",
    }),
});

export const ProviderProfileBioStepSchema = z.object({
  phoneNumber: z
    .string()
    .length(10, { message: "Please enter a valid 10-digit phone number" })
    .regex(/^0\d{9}$/, {
      message: "Phone number must start with 0 and be 10 digits",
    }),
  bio: z
    .string()
    .trim()
    .min(10, { message: "Status must be at least 10 characters" })
    .max(140, { message: "Status must be 140 characters or less" }),
});

export const ProviderProfileSpecialtyStepSchema = z.object({
  specialty: z.string().min(1, { message: "Please select a specialty" }),
});

export type ProviderProfilePhotoStepData = z.infer<
  typeof ProviderProfilePhotoStepSchema
>;
export type ProviderProfileBioStepData = z.infer<
  typeof ProviderProfileBioStepSchema
>;
export type ProviderProfileSpecialtyStepData = z.infer<
  typeof ProviderProfileSpecialtyStepSchema
>;
