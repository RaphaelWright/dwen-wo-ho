import * as z from "zod";

export const ProviderEmailSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

export const ProviderLoginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

export const ProviderSignUpSchema = z.object({
  email: z
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

const GhanaPhoneNumberSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(
    z
      .string()
      .refine((digits) => /^\d{9}$/.test(digits) || /^0\d{9}$/.test(digits), {
        message:
          "Please enter a valid 9-digit number or 10-digit number starting with 0",
      })
      .transform((digits) =>
        digits.length === 10 ? `+233${digits.slice(1)}` : `+233${digits}`,
      ),
  );

export const ProviderProfileBioStepSchema = z.object({
  phoneNumber: GhanaPhoneNumberSchema,
  bio: z
    .string()
    .trim()
    .min(1, { message: "My Slogan must be at least 1 character" })
    .max(140, { message: "My Slogan must be 140 characters or less" }),
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
