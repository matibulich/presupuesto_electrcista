import Link from "next/link";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const orders = [
  {
    id: "00124",
    customer: "Juan Pérez",
    phone: "351 1234567",
    work: "Instalación eléctrica",
    priority: "Normal",
    status: "En proceso",
    date: "25/08/2026",
  },
  {
    id: "00123",
    customer: "Carlos López",
    phone: "351 7654321",
    work: "Reparación de tablero",
    priority: "Urgente",
    status: "Pendiente",
    date: "24/08/2026",
  },
  {
    id: "00122",
    customer: "Pedro Gómez",
    phone: "351 4567890",
    work: "Mantenimiento",
    priority: "Normal",
    status: "Finalizada",
    date: "23/08/2026",
  },
  {
    id: "00121",
    customer: "Martín Díaz",
    phone: "351 9876543",
    work: "Instalación de luminarias",
    priority: "Normal",
    status: "Finalizada",
    date: "22/08/2026",
  },
];

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Encabezado */}
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

            {/* Resumen */}
            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryCard
                title="Pendientes"
                value="4"
              />

              <SummaryCard
                title="En proceso"
                value="2"
              />

              <SummaryCard
                title="Finalizadas"
                value="18"
              />
            </div>

            {/* Listado */}
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
                          className="border-b last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-6 py-4 font-medium">
                            #{order.id}
                          </td>

                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">
                                {order.customer}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {order.phone}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {order.work}
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
                            {order.date}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Link href={`/ordenes/${order.id}`}>
                                Ver
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
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

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <p className="mt-2 text-3xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "Finalizada") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Finalizada
      </Badge>
    );
  }

  if (status === "En proceso") {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        En proceso
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
  if (priority === "Urgente") {
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