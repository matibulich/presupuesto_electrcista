import Link from "next/link";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Encabezado */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Buenos días 👋
                </h1>

                <p className="mt-1 text-muted-foreground">
                  Acá tenés el resumen de tus órdenes de trabajo.
                </p>
              </div>

              <Link
                href="/ordenes/nueva"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                + Nueva orden
              </Link>
            </section>

            {/* Métricas */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Pendientes"
                value="4"
                description="Esperando atención"
              />

              <StatCard
                title="En proceso"
                value="2"
                description="Actualmente trabajando"
              />

              <StatCard
                title="Finalizadas"
                value="18"
                description="Trabajos completados"
              />

              <StatCard
                title="Total"
                value="24"
                description="Órdenes registradas"
              />
            </section>

            {/* Órdenes recientes */}
            <section className="rounded-xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h2 className="font-semibold">
                    Órdenes recientes
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Últimos trabajos registrados
                  </p>
                </div>

                <Link
                  href="/ordenes"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Ver todas
                </Link>
              </div>

              <div className="divide-y">
                <OrderRow
                  number="00124"
                  customer="Juan Pérez"
                  work="Instalación eléctrica"
                  status="En proceso"
                  statusClass="bg-blue-100 text-blue-700"
                />

                <OrderRow
                  number="00123"
                  customer="Carlos López"
                  work="Reparación"
                  status="Finalizada"
                  statusClass="bg-green-100 text-green-700"
                />

                <OrderRow
                  number="00122"
                  customer="Pedro Gómez"
                  work="Mantenimiento"
                  status="Pendiente"
                  statusClass="bg-yellow-100 text-yellow-700"
                />

                <OrderRow
                  number="00121"
                  customer="Martín Díaz"
                  work="Instalación"
                  status="Finalizada"
                  statusClass="bg-green-100 text-green-700"
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function OrderRow({
  number,
  customer,
  work,
  status,
  statusClass,
}: {
  number: string;
  customer: string;
  work: string;
  status: string;
  statusClass: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-semibold sm:flex">
          #{number.slice(-2)}
        </div>

        <div>
          <p className="font-medium">
            {customer}
          </p>

          <p className="text-sm text-muted-foreground">
            {work}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="text-sm text-muted-foreground">
          #{number}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}