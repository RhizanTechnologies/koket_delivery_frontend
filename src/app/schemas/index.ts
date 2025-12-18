import { z } from "zod";

/**
 * Authentication Schemas
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Product Schema (for admin product creation/editing)
 */
export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  size: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1").optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment cannot exceed 500 characters"),
});

/**
 * Order Schemas
 */
export const orderSchema = z.object({
  phone_number: z
    .string()
    .regex(
      /^(09|07)\d{8}$/,
      "Phone number must start with 09 or 07 and be 10 digits"
    ),
  delivery_time: z.string().min(1, "Delivery date is required"),
  upfront_paid: z.number().positive("Upfront payment must be greater than 0"),
  total_price: z.number().positive("Total price must be greater than 0"),
  order_items: z
    .array(
      z.object({
        _id: z.string(),
      })
    )
    .min(1, "At least one item is required"),
  payment_proof_file: z.instanceof(File, {
    message: "Payment proof is required",
  }),
});

/**
 * Contact Form Schema
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(
      /^(09|07)\d{8}$/,
      "Phone number must start with 09 or 07 and be 10 digits"
    )
    .optional()
    .or(z.literal("")),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .regex(
      /^(09|07)\d{8}$/,
      "Phone number must start with 09 or 07 and be 10 digits"
    )
    .optional()
    .or(z.literal("")),
});

/**
 * Password Change Schema
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Cart Item Schema
 */
export const addToCartSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  kilo: z.number().positive("Weight must be positive").optional(),
  pieces: z.number().int().positive("Pieces must be at least 1").optional(),
  custom_text: z
    .string()
    .max(200, "Custom text cannot exceed 200 characters")
    .optional(),
  additional_description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

/**
 * Type exports
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
