"use server";

import { prisma } from "@/lib/prisma";
import {
  workOrderSchema,
  type WorkOrderFormData,
} from "@/lib/validations/orders";

export async function createWorkOrder(data: WorkOrderFormData) {
  // Validar nuevamente en el servidor.
  // Nunca debemos confiar únicamente en la validación del navegador.
  const result = workOrderSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Los datos de la orden no son válidos.",
    };
  }

  const {
    customerName,
    phone,
    address,
    workType,
    description,
    observations,
    budget,
    priority,
    materials,
  } = result.data;

  try {
    const workOrder = await prisma.$transaction(async (tx) => {
      // 1. Buscar si el cliente ya existe
      let customer = await tx.customer.findFirst({
        where: {
          phone,
        },
      });

      // 2. Si no existe, crear cliente
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: customerName,
            phone,
            address: address || null,
          },
        });
      } else {
        // Actualizar datos del cliente existente
        customer = await tx.customer.update({
          where: {
            id: customer.id,
          },
          data: {
            name: customerName,
            address: address || null,
          },
        });
      }

      // 3. Crear la orden
      const newWorkOrder = await tx.workOrder.create({
        data: {
          customerId: customer.id,
          type: workType,
          description,
          priority,
          observations: observations || null,
          budget: budget ?? null,

          materials: {
            create: (materials || []).map((material) => ({
              description: material.description,
              quantity: Number(material.quantity),
              unit: material.unit,
              price: material.price ?? null,
            })),
          },
        },

        include: {
          customer: true,
          materials: true,
        },
      });

      return newWorkOrder;
    });

    return {
      success: true,
      workOrder: {
        id: workOrder.id,
        number: workOrder.number,
      },
    };
  } catch (error) {
    console.error("Error creando orden de trabajo:", error);

    return {
      success: false,
      error: "No se pudo crear la orden de trabajo.",
    };
  }
}
export async function updateWorkOrder(
  id: string,
  data: WorkOrderFormData
) {
  const result = workOrderSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Los datos de la orden no son válidos.",
    };
  }

  const {
    customerName,
    phone,
    address,
    workType,
    description,
    observations,
    budget,
    priority,
    materials,
  } = result.data;

  try {
    const workOrder = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.workOrder.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new Error("Orden no encontrada");
      }

      await tx.customer.update({
  where: {
    id: existingOrder.customerId,
  },
  data: {
    name: customerName,
    phone,
    address: address || null,
  },
});

      await tx.workOrderMaterial.deleteMany({
        where: {
          workOrderId: id,
        },
      });

      const updatedOrder = await tx.workOrder.update({
        where: {
          id,
        },
        data: {
          type: workType,
          description,
          priority,
          observations: observations || null,
          budget: budget ?? null,

          materials: {
            create: (materials || []).map((material) => ({
              description: material.description,
              quantity: Number(material.quantity),
              unit: material.unit,
              price: material.price ?? null,
            })),
          },
        },
        include: {
          customer: true,
          materials: true,
        },
      });

      return updatedOrder;
    });

    return {
      success: true,
      workOrder: {
        id: workOrder.id,
        number: workOrder.number,
      },
    };
  } catch (error) {
    console.error("Error actualizando orden:", error);

    return {
      success: false,
      error: "No se pudo actualizar la orden.",
    };
  }
}

export async function deleteWorkOrder(id: string) {
  try {
    await prisma.workOrder.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error eliminando orden:", error);
    return {
      success: false,
      error: "No se pudo eliminar la orden.",
    };
  }
}

export async function updateWorkOrderStatus(
  id: string,
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
) {
  try {
    const order = await prisma.workOrder.update({
      where: {
        id,
      },
      data: {
        status,
        completedAt:
          status === "COMPLETED" ? new Date() : null,
      },
    });

    return {
      success: true,
      status: order.status,
    };
  } catch (error) {
    console.error("Error actualizando estado:", error);

    return {
      success: false,
      error: "No se pudo actualizar el estado.",
    };
  }
}
