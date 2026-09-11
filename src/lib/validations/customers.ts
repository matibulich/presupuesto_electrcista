import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(3, "Ingresá un nombre válido"),
  phone: z.string().min(8, "Ingresá un teléfono válido"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
