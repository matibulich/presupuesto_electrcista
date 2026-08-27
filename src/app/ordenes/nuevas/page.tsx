"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

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
  workOrderSchema,
  type WorkOrderFormData,
} from "@/lib/validations/orders";

export default function NewOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),

    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      workType: "",
      description: "",
      observations: "",
      priority: "NORMAL",

      materials: [
        {
          description: "",
          quantity: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  function onSubmit(data: WorkOrderFormData) {
    setIsSubmitting(true);

    console.log("ORDEN DE TRABAJO:", data);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-4xl space-y-6"
          >
            {/* ENCABEZADO */}
            <div>
              <Link
                href="/ordenes"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Volver a órdenes
              </Link>

              <h1 className="mt-3 text-2xl font-bold tracking-tight">
                Nueva orden de trabajo
              </h1>

              <p className="mt-1 text-muted-foreground">
                Completá los datos del trabajo.
              </p>
            </div>

            {/* DATOS DEL CLIENTE */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Datos del cliente
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-5 sm:grid-cols-2">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nombre *
                  </label>

                  <Input
                    {...register("customerName")}
                    placeholder="Ej. Juan Pérez"
                  />

                  {errors.customerName && (
                    <p className="text-sm text-red-500">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Teléfono *
                  </label>

                  <Input
                    {...register("phone")}
                    placeholder="Ej. 351 1234567"
                  />

                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Dirección */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">
                    Dirección
                  </label>

                  <Input
                    {...register("address")}
                    placeholder="Ej. Av. Colón 1234"
                  />

                  {errors.address && (
                    <p className="text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* INFORMACIÓN DEL TRABAJO */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Información del trabajo
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Tipo de trabajo */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tipo de trabajo *
                  </label>

                  <Input
                    {...register("workType")}
                    placeholder="Ej. Instalación eléctrica"
                  />

                  {errors.workType && (
                    <p className="text-sm text-red-500">
                      {errors.workType.message}
                    </p>
                  )}
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Descripción *
                  </label>

                  <Textarea
                    {...register("description")}
                    placeholder="Describí el trabajo a realizar..."
                    className="min-h-32 resize-none"
                  />

                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* PRIORIDAD */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Prioridad
                  </label>

                  <div className="flex gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="NORMAL"
                        {...register("priority")}
                        className="peer sr-only"
                      />

                      <span className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:bg-muted">
                        Normal
                      </span>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="URGENT"
                        {...register("priority")}
                        className="peer sr-only"
                      />

                      <span className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition-colors peer-checked:border-destructive peer-checked:bg-destructive peer-checked:text-white hover:bg-muted">
                        Urgente
                      </span>
                    </label>
                  </div>

                  {errors.priority && (
                    <p className="text-sm text-red-500">
                      {errors.priority.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* MATERIALES */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Materiales
                  </CardTitle>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        description: "",
                        quantity: "",
                      })
                    }
                  >
                    + Agregar
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Encabezados */}
                  <div className="hidden grid-cols-[1fr_120px_40px] gap-3 px-1 text-xs font-medium text-muted-foreground sm:grid">
                    <span>Material</span>
                    <span>Cantidad</span>
                    <span />
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-3 sm:grid-cols-[1fr_120px_40px]"
                    >
                      {/* Material */}
                      <div>
                        <Input
                          {...register(
                            `materials.${index}.description`
                          )}
                          placeholder="Ej. Cable 2,5mm"
                        />

                        {errors.materials?.[index]?.description && (
                          <p className="mt-1 text-xs text-red-500">
                            {
                              errors.materials[index]?.description
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      {/* Cantidad */}
                      <div>
                        <Input
                          {...register(
                            `materials.${index}.quantity`
                          )}
                          placeholder="Cantidad"
                        />

                        {errors.materials?.[index]?.quantity && (
                          <p className="mt-1 text-xs text-red-500">
                            {
                              errors.materials[index]?.quantity
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      {/* Eliminar */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        title="Eliminar material"
                      >
                        ×
                      </Button>
                    </div>
                  ))}

                  {errors.materials?.root && (
                    <p className="text-sm text-red-500">
                      {errors.materials.root.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* OBSERVACIONES */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Observaciones
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Textarea
                  {...register("observations")}
                  placeholder="Información adicional..."
                  className="min-h-28 resize-none"
                />

                {errors.observations && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.observations.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ACCIONES */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                asChild
                variant="outline"
              >
                <Link href="/ordenes">
                  Cancelar
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Procesando..."
                  : "Crear orden"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}