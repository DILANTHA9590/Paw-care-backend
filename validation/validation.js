import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters"),
  firstName: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name cannot be longer than 50 characters"),

  lastName: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name cannot be longer than 50 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(10, "Password must be less than 100 characters"),

  age: z.coerce
    .number()
    .int("Age must be an integer")
    .positive("Age must be positive"),

  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
});
