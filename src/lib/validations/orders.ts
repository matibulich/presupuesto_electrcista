import { z } from "zod";

export const workOrderSchema = z.object({
  customerName: z
    .string()
    .min(3, "Ingresá un nombre válido"),

  phone: z
    .string()
    .min(8, "Ingresá un teléfono válido"),

  address: z.string().optional(),

  workType: z
    .string()
    .min(3, "Elegí un tipo de trabajo"),

  description: z
    .string()
    .min(10, "La descripción es muy corta"),

  observations: z.string().optional(),

  priority: z.enum(["NORMAL", "URGENT"]),

  materials: z
    .array(
      z.object({
        description: z.string().min(1,"Escribe al menos un caracter"),
        quantity: z.string().min(1,"La cantidad debe ser numero"),
      })
    )
    .min(1),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;