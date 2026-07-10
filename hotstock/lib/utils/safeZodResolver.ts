import { z } from "zod";
import type { Resolver, FieldErrors, FieldValues } from "react-hook-form";

/**
 * Safe Zod Resolver that converts ZodError into the field-error shape
 * react-hook-form expects. Avoids uncaught promise rejections.
 *
 * Zod v4 widens `z.infer<T>` to `unknown` in many constraint positions,
 * so we bridge through `unknown` only inside the function body. The
 * public API exposes a `Resolver<TFieldValues>` parameterized by the
 * consumer's form value type.
 */
type AnyZodResolver = (values: unknown, context: unknown, options: unknown) => Promise<unknown>;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { zodResolver } = require("@hookform/resolvers/zod") as {
  zodResolver: (schema: z.ZodTypeAny) => AnyZodResolver;
};

export function createSafeZodResolver<TFieldValues extends FieldValues>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<TFieldValues, TFieldValues, any>,
): Resolver<TFieldValues> {
  const resolver = zodResolver(schema as z.ZodTypeAny);

  return (async (values: unknown, context: unknown, options: unknown) => {
    try {
      return await resolver(values, context, options);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FieldErrors<TFieldValues> = {};
        for (const issue of error.issues) {
          const path = issue.path.join(".");
          if (path) {
            (fieldErrors as Record<string, { type: string; message: string }>)[path] = {
              type: issue.code,
              message: issue.message,
            };
          }
        }
        return {
          values: {},
          errors: fieldErrors,
        };
      }
      throw error;
    }
  }) as unknown as Resolver<TFieldValues>;
}
