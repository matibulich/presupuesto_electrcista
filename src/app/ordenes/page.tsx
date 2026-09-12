import Link from "next/link";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import DeleteButton from "./DeleteButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.workOrder.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
    },
  });

  const pendingCount = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const inProgressCount = orders.filter(
    (order) => order.status === "IN_PROGRESS"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* ENCABEZADO */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Órdenes de trabajo
                </h1>

                <p className="mt-1 text-muted-foreground">
                  Gestioná y consultá tus órdenes de trabajo.
                </p>
              </div>

              <Link
                href="/ordenes/nuevas"
                className={buttonVariants()}
              >
                + Nueva orden
              </Link>
            </div>

            {/* RESUMEN */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(30,41,59,0.06)] p-5 transition-shadow hover:shadow-[0_14px_40px_rgba(30,41,59,0.1)]">
                <p className="text-sm font-semibold text-slate-400 tracking-wide">Pendientes</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-800">{pendingCount}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(30,41,59,0.06)] p-5 transition-shadow hover:shadow-[0_14px_40px_rgba(30,41,59,0.1)]">
                <p className="text-sm font-semibold text-slate-400 tracking-wide">En proceso</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-800">{inProgressCount}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(30,41,59,0.06)] p-5 transition-shadow hover:shadow-[0_14px_40px_rgba(30,41,59,0.1)]">
                <p className="text-sm font-semibold text-slate-400 tracking-wide">Finalizadas</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-800">{completedCount}</p>
              </div>
            </div>

            {/* LISTADO */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-base">
                    Todas las órdenes
                  </CardTitle>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar orden..."
                      className="w-full sm:w-64"
                    />

                    <Button variant="outline">
                      Filtrar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y bg-muted/40">
                        <th className="px-6 py-3 text-left font-medium">
                          Orden
                        </th>

                        <th className="px-6 py-3 text-left font-medium">
                          Cliente
                        </th>

                        <th className="px-6 py-3 text-left font-medium">
                          Trabajo
                        </th>

                        <th className="px-6 py-3 text-left font-medium">
                          Prioridad
                        </th>

                        <th className="px-6 py-3 text-left font-medium">
                          Estado
                        </th>

                        <th className="px-6 py-3 text-left font-medium">
                          Fecha
                        </th>

                        <th className="px-6 py-3" />
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className={`border-b last:border-0 hover:bg-muted/30 cursor-pointer`}
                        >
                          <td className="px-6 py-4 font-medium">
                            #{order.number
                              .toString()
                              .padStart(5, "0")}
                          </td>

                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">
                                {order.customer.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {order.customer.phone}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {order.type}
                          </td>

                          <td className="px-6 py-4">
                            <PriorityBadge
                              priority={order.priority}
                            />
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge
                              status={order.status}
                            />
                          </td>

                          <td className="px-6 py-4 text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/ordenes/${order.id}`}
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "sm",
                                })}
                              >
                                Ver
                              </Link>
                              <DeleteButton id={order.id} />
                            </div>
                          </td>
                        </tr>
                      ))}

                      {orders.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-10 text-center text-muted-foreground"
                          >
                            No hay órdenes de trabajo todavía.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
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
    return (
      <Badge variant="destructive">
        Cancelada
      </Badge>
    );
  }

  return (
    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
      Pendiente
    </Badge>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  if (priority === "URGENT") {
    return (
      <Badge variant="destructive">
        Urgente
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      Normal
    </Badge>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}