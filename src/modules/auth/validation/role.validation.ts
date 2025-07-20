import z from "zod";

const baseSchema = z.object({
  name: z.string({
    error: "the name is required",
  }),
});

export const storeRoleSchema = baseSchema;
export const updateRoleSchema = baseSchema.partial();
