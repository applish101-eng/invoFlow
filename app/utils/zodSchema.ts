import { z } from "zod";
export const onboardingSchema = z.object({
  firstName: z.string().min(3, {message:"Frist name is required"}),
  lastName: z.string().min(3, {message:"Last name is required"}),
  address:z.string().min(3, {message:"Address is required"}),
});
