import z from "zod/v4";

export const campusStep1Schema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  motto: z.string(),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
});

export type CampusStep1FormValues = z.infer<typeof campusStep1Schema>;
