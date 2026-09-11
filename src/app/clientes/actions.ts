"use server";

import { prisma } from "@/lib/prisma";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customers";

export async function createCustomer(data: CustomerFormData) {
  const result = customerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Los datos no son válidos." };
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name: result.data.name,
        phone: result.data.phone,
        address: result.data.address || null,
        notes: result.data.notes || null,
      },
    });
    return { success: true, customer };
  } catch (error) {
    console.error("Error creando cliente:", error);
    return { success: false, error: "No se pudo crear el cliente." };
  }
}

export async function updateCustomer(id: string, data: CustomerFormData) {
  const result = customerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Los datos no son válidos." };
  }

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: result.data.name,
        phone: result.data.phone,
        address: result.data.address || null,
        notes: result.data.notes || null,
      },
    });
    return { success: true, customer };
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    return { success: false, error: "No se pudo actualizar el cliente." };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    return { success: false, error: "No se pudo eliminar el cliente." };
  }
}
