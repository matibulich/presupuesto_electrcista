
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
      (val) => val === undefined || val >= 0,
      "El precio debe ser mayor o igual a 0"
    ),

  priority: z.enum(["NORMAL", "URGENT"]),

  materials: z
    .array(
      z.object({
        description: z
          .string()
          .min(1, "Escribí al menos un carácter"),

        quantity: z
          .string()
          .regex(/^\d+$/, "La cantidad debe ser un número")
          .refine(
            (value) => Number(value) > 0,
            "La cantidad debe ser mayor a 0"
          ),

        price: z
          .number()
          .optional()
          .refine(
            (val) => val === undefined || val >= 0,
      "El presupuesto debe ser mayor o igual a 0"
          ),

        unit: z
          .string()
          .min(1, "Escribí al menos un carácter"),
      })
    )
    .optional(),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
