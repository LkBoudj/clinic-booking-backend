import z from "zod";
import UserModel, { EGender } from "../models/user.model";

export const baseUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  avatar: z.string().optional(),
  email: z.email("Invalid email address").refine(
    async (email) => {
      const isExist = await UserModel.findByEmail(email);
      return !isExist;
    },
    {
      error: "the email is exits",
    }
  ),
  // email: z.email("Invalid email address"),
  phone: z.string().optional(),
  gender: z.enum(Object.values(EGender)).optional(),
  role: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid role ID"))
    .optional(), // MongoDB ObjectId
  is_active: z.boolean().optional(),
});

export const storeUserSchema = baseUserSchema.extend({
  password: z.string().min(3, "Password must be at least 8 characters"),
  // .regex(/[A-Z]/, "Password must contain an uppercase letter")
  // .regex(/[a-z]/, "Password must contain a lowercase letter")
  // .regex(/\d/, "Password must contain a number"),
});

export const updateUserSchema = baseUserSchema.partial().extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/\d/, "Password must contain a number")
    .optional(),
});
