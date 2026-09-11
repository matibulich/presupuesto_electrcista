"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  customerSchema,
  type CustomerFormData,
} from "@/lib/validations/customers";

type CustomerFormProps = {
  mode: "create" | "edit";
  initialData?: CustomerFormData;
  customerId?: string;
};

export default function CustomerForm({
  mode,
  initialData,
  customerId,
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData ?? {
      name: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      let result;
      if (mode === "create") {
        const { createCustomer } = await import("@/app/clientes/actions");
        result = await createCustomer(data);
      } else {
        const { updateCustomer } = await import("@/app/clientes/actions");
        if (!customerId) {
          console.error("Falta el ID del cliente.");
          return;
        }
        result = await updateCustomer(customerId, data);
      }

      if (!result?.success) {
        console.error(result?.error || "Error desconocido");
        return;
      }

      router.push("/clientes");
      router.refresh();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div>
        <Link
          href="/clientes"
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          ← Volver a clientes
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          {mode === "create" ? "Nuevo cliente" : "Editar cliente"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {mode === "create"
            ? "Completá los datos del cliente."
            : "Modificá los datos del cliente."}
        </p>
      </div>

      <Card className="bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md border-white/20 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
        <CardHeader>
          <CardTitle className="text-base">Datos del cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre *
            </label>
            <Input id="name" {...register("name")} placeholder="Ej. Juan Pérez" />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Teléfono *
            </label>
            <Input id="phone" {...register("phone")} placeholder="Ej. 351 1234567" />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="address" className="text-sm font-medium">
              Dirección
            </label>
            <Input
              id="address"
              {...register("address")}
              placeholder="Ej. Av. Colón 1234"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notas
            </label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Observaciones adicionales..."
              className="min-h-28 resize-none"
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/clientes">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Procesando..."
            : mode === "create"
              ? "Crear cliente"
              : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
