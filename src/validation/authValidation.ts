import { z } from "zod";

// Zod Schema for Login
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

// Zod Schema for Registration
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address format"),
    phone: z.string().trim().optional(),
    role: z.enum(["TENANT", "OWNER", "ADMIN"]),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, "You must accept the Terms of Service & Privacy Policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;

// Zod Schema for Password Reset Request
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address format"),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
