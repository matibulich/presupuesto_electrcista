
import { z } from "zod";

export const workOrderSchema = z.object({
  customerName: z
    .string()
    .min(3, "Ingresá un nombre válido"),

  phone: z
    .string()
    .min(8, "Ingresá un teléfono válido"),

  address: z
    .string()
    .optional(),

  workType: z
    .string()
    .min(3, "Elegí un tipo de trabajo"),

  description: z
    .string()
    .min(10, "La descripción es muy corta"),

  observations: z
    .string()
    .optional(),

  budget: z
    .number()
    .optional()
    .refine(
      (val) => val === undefined || val === null || (!isNaN(val) && val >= 0),
      "El presupuesto debe ser mayor o igual a 0"
    ),

  priority: z.enum(["NORMAL", "URGENT"]),

  materials: z
    .array(
      z.object({
        description: z.string().optional(),

        quantity: z.string().optional(),

        price: z.number().optional(),

        unit: z.string().optional(),
      })
    )
    .optional(),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
