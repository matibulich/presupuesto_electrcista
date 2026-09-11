import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { prisma } from "@/lib/prisma";
import StatusActions from "./StatusActions";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      materials: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* ENCABEZADO */}
            <div>
              <Link
                href="/ordenes"
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ← Volver a órdenes
              </Link>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">
                      Orden #{order.number.toString().padStart(5, "0")}
                    </h1>

                    <StatusBadge status={order.status} />
                  </div>

                  <p className="mt-1 text-muted-foreground">
                    Creada el {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href={`/ordenes/${order.id}/editar`}>
                      <Button variant="outline">Editar</Button>
                    </Link>

                    <a
                      href={`/api/ordenes/${order.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button type="button">Generar PDF</Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ACCIONES DE ESTADO */}
            <StatusActions id={order.id} status={order.status} />

            {/* DATOS DEL CLIENTE */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Datos del cliente</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-5 sm:grid-cols-2">
                <InfoItem label="Nombre" value={order.customer.name} />

                <InfoItem label="Teléfono" value={order.customer.phone} />

                <InfoItem
                  label="Dirección"
                  value={order.customer.address || "Sin dirección"}
                  fullWidth
                />
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
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tipo de trabajo
                    </p>

                    <p className="mt-1 font-medium">{order.type}</p>
                  </div>

                  <PriorityBadge priority={order.priority} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>

                  <p className="mt-2 whitespace-pre-wrap">
                    {order.description}
                  </p>
                </div>

                {order.budget !== null && order.budget !== undefined && (
                  (() => {
                    const materialsTotal = order.materials.reduce((sum, material) => {
                      if (material.price !== null && material.price !== undefined) {
                        return sum + Number(material.price);
                      }
                      return sum;
                    }, 0);
                    const total = order.budget! + materialsTotal;
                    return (
                      <div>
                        <p className="text-sm text-muted-foreground">Presupuesto</p>
                        <p className="mt-1 font-medium text-lg text-emerald-600">
                          ${total.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {materialsTotal > 0 && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">
                              (base ${Number(order.budget).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + mat. ${materialsTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })()
                )}
              </CardContent>
            </Card>

            {/* MATERIALES */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Materiales</CardTitle>
              </CardHeader>

              <CardContent>
                {order.materials.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y bg-muted/40">
                          <th className="px-4 py-3 text-left font-medium">
                            Material
                          </th>

                          <th className="px-4 py-3 text-left font-medium">
                            Cantidad
                          </th>

                          <th className="px-4 py-3 text-left font-medium">
                            Unidad
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            Precio unitario
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {order.materials.map((material) => (
                          <tr
                            key={material.id}
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-3">
                              {material.description}
                            </td>

                            <td className="px-4 py-3">{material.quantity}</td>

                            <td className="px-4 py-3 text-muted-foreground">
                              {material.unit || "-"}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                              {material.price !== null && material.price !== undefined
                                ? `$${Number(material.price).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No se registraron materiales.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* OBSERVACIONES */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Observaciones</CardTitle>
              </CardHeader>

              <CardContent>
                {order.observations ? (
                  <p className="whitespace-pre-wrap">{order.observations}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sin observaciones.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* INFORMACIÓN */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Información de la orden
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-5 sm:grid-cols-3">
                <InfoItem
                  label="Número"
                  value={`#${order.number.toString().padStart(5, "0")}`}
                />

                <InfoItem label="Estado" value={getStatusLabel(order.status)} />

                <InfoItem
                  label="Prioridad"
                  value={getPriorityLabel(order.priority)}
                />

                <InfoItem label="Creada" value={formatDate(order.createdAt)} />

                <InfoItem
                  label="Última modificación"
                  value={formatDate(order.updatedAt)}
                />

                {order.completedAt && (
                  <InfoItem
                    label="Finalizada"
                    value={formatDate(order.completedAt)}
                  />
                )}
              </CardContent>
            </Card>

            {/* ACCIONES */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link href="/ordenes">
                <Button variant="outline">Volver a órdenes</Button>
              </Link>

            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "COMPLETED") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Finalizada
      </Badge>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        En proceso
      </Badge>
    );
  }

  if (status === "CANCELLED") {
    return <Badge variant="destructive">Cancelada</Badge>;
  }

  return (
    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
      Pendiente
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === "URGENT") {
    return <Badge variant="destructive">Urgente</Badge>;
  }

  return <Badge variant="secondary">Normal</Badge>;
}

function getStatusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Finalizada";

    case "IN_PROGRESS":
      return "En proceso";

    case "CANCELLED":
      return "Cancelada";

    default:
      return "Pendiente";
  }
}

function getPriorityLabel(priority: string) {
  return priority === "URGENT" ? "Urgente" : "Normal";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
