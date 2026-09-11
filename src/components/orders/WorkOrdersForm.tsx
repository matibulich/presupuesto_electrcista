"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
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
  workOrderSchema,
  type WorkOrderFormData,
} from "@/lib/validations/orders";

type WorkOrderFormProps = {
  mode: "create" | "edit";
  initialData?: WorkOrderFormData;
  orderId?: string;
};

export default function WorkOrderForm({
  mode,
  initialData,
  orderId,
}: WorkOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),

    defaultValues: initialData ?? {
      customerName: "",
      phone: "",
      address: "",
      workType: "",
      description: "",
      budget: undefined,
      observations: "",
      priority: "NORMAL",

      materials: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  const onSubmit = async (data: WorkOrderFormData) => {
    setIsSubmitting(true);

    try {
      let result;

      if (mode === "create") {
        const { createWorkOrder } = await import(
          "@/app/ordenes/actions"
        );

        result = await createWorkOrder(data);
      } else {
        const { updateWorkOrder } = await import(
          "@/app/ordenes/actions"
        );

        if (!orderId) {
          console.error("Falta el ID de la orden.");
          return;
        }

        result = await updateWorkOrder(orderId, data);
      }

      if (!result.success) {
        console.error(result.error);
        return;
      }

      if (!result.workOrder) {
  console.error("La orden fue creada pero no se recibió su ID.");
  return;
}

      router.push(
        mode === "create"
          ? "/ordenes"
          : `/ordenes/${result.workOrder.id}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        mode === "create"
          ? "Error al crear la orden:"
          : "Error al actualizar la orden:",
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* ENCABEZADO */}
      <div>
        <Link
          href="/ordenes"
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          ← Volver a órdenes
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          {mode === "create"
            ? "Nueva orden de trabajo"
            : "Editar orden de trabajo"}
        </h1>

        <p className="mt-1 text-muted-foreground">
          {mode === "create"
            ? "Completá los datos del trabajo."
            : "Modificá los datos de la orden."}
        </p>
      </div>

      {/* DATOS DEL CLIENTE */}
      <Card className="bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md border-white/20 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
        <CardHeader>
          <CardTitle className="text-base">
            Datos del cliente
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
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
      <Card className="bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md border-white/20 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
        <CardHeader>
          <CardTitle className="text-base">
            Información del trabajo
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
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

          {/* PRECIO DEL SERVICIO */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Presupuesto (opcional)
            </label>
            <Input
              {...register("budget", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej. 15000"
            />
            {errors.budget && (
              <p className="text-sm text-red-500">
                {errors.budget.message}
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

                <span className="inline-flex cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:bg-muted">
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

                <span className="inline-flex cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors peer-checked:border-destructive peer-checked:bg-destructive peer-checked:text-white hover:bg-muted">
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
      <Card className="bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md border-white/20 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
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
                  unit: "",
                  price: undefined,
                })
              }
            >
              + Agregar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="hidden grid-cols-[1fr_120px_100px_100px_40px] gap-3 px-1 text-xs font-medium text-muted-foreground sm:grid">
              <span>Material</span>
              <span>Cantidad</span>
              <span>Unidad</span>
              <span>Precio</span>
              <span />
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 sm:grid-cols-[1fr_120px_100px_100px_40px]"
              >
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

                <div>
                  <Input
                    {...register(`materials.${index}.unit`)}
                    placeholder="Ej. m"
                  />

                  {errors.materials?.[index]?.unit && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        errors.materials[index]?.unit?.message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...register(
                      `materials.${index}.price`, { valueAsNumber: true }
                    )}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Precio"
                  />

                  {errors.materials?.[index]?.price && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        errors.materials[index]?.price?.message
                      }
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={false}
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
      <Card className="bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md border-white/20 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
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
        <Link href="/ordenes">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </Link>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Procesando..."
            : mode === "create"
              ? "Crear orden"
              : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}