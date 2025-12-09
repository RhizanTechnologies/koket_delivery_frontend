import { z } from "zod";

/**
 * Validate data against a Zod schema
 * Returns validated data or throws an error with user-friendly messages
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      throw new Error(errorMessages);
    }
    throw error;
  }
}

/**
 * Validate data and return result with success/error
 * Useful for form validation without throwing
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; error: string; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((err: z.ZodIssue) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  // Get first error message for user-friendly display
  const firstError = result.error.issues[0]?.message || "Validation error";

  return { success: false, error: firstError, errors };
}

/**
 * Get first error message from Zod validation
 */
export function getFirstError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || "Validation error";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown validation error";
}
