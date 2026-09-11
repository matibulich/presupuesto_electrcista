import Link from "next/link";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";

export default async function ClientesPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

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
                <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                <p className="mt-1 text-muted-foreground">
                  Gestioná los datos de tus clientes.
                </p>
              </div>
              <Link href="/clientes/nuevo" className={buttonVariants()}>
                + Nuevo cliente
              </Link>
            </div>

            {/* LISTADO */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-base">Todos los clientes</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="Buscar cliente..." className="w-full sm:w-64" />
                    <Button variant="outline">Filtrar</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y bg-muted/40">
                        <th className="px-6 py-3 text-left font-medium">Nombre</th>
                        <th className="px-6 py-3 text-left font-medium">Teléfono</th>
                        <th className="px-6 py-3 text-left font-medium">Dirección</th>
                        <th className="px-6 py-3 text-left font-medium">Notas</th>
                        <th className="px-6 py-3 text-left font-medium">Fecha</th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                        >
                          <td className="px-6 py-4 font-medium">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">{customer.phone}</Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {customer.address || "—"}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">
                            {customer.notes || "—"}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {formatDate(customer.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/clientes/${customer.id}/editar`}
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "sm",
                                })}
                              >
                                Editar
                              </Link>
                              <DeleteButton id={customer.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-muted-foreground"
                          >
                            No hay clientes registrados.
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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
