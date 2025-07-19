import z from "zod";
export const querySchema = z
  .object({
    search: z.string().optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined))
      .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
        message: "Page must be a positive number",
      }),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined))
      .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
        message: "Limit must be a positive number",
      }),
  })
  .loose();
