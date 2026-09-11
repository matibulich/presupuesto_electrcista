import Link from "next/link";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";

import DeleteButton from "./ordenes/DeleteButton";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [orders, counts] = await Promise.all([
    prisma.workOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true },
      take: 4,
    }),
    prisma.$transaction([
      prisma.workOrder.count({ where: { status: "PENDING" } }),
      prisma.workOrder.count({ where: { status: "IN_PROGRESS" } }),
      prisma.workOrder.count({ where: { status: "COMPLETED" } }),
      prisma.workOrder.count(),
    ]),
  ]);

  const [pending, inProgress, completed, total] = counts;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Encabezado */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-800">
                  Buenos días 👋
                </h1>

                <p className="mt-1 text-slate-500">
                  Acá tenés el resumen de tus órdenes de trabajo.
                </p>
              </div>

              <Link
                href="/ordenes/nuevas"
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(79,70,229,0.25)] transition-all hover:shadow-[0_6px_24px_rgba(79,70,229,0.35)] hover:-translate-y-0.5"
              >
                + Nueva orden
              </Link>
            </section>

            {/* Métricas */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Pendientes" value={pending} desc="Esperando atención" />
              <MetricCard label="En proceso" value={inProgress} desc="Actualmente trabajando" />
              <MetricCard label="Finalizadas" value={completed} desc="Trabajos completados" />
              <MetricCard label="Total" value={total} desc="Órdenes registradas" />
            </section>

            {/* Órdenes recientes */}
            <section className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(30,41,59,0.06)] overflow-hidden transition-shadow hover:shadow-[0_14px_40px_rgba(30,41,59,0.1)]">
              <div className="flex items-center justify-between border-b border-white/20 p-5">
                <div>
                  <h2 className="font-bold text-slate-800 text-base">
                    Órdenes recientes
                  </h2>
                  <p className="text-sm text-slate-400">
                    Últimos trabajos registrados
                  </p>
                </div>

                <Link
                  href="/ordenes"
                  className="text-sm cursor-pointer font-semibold text-indigo-600 hover:text-violet-700 hover:underline transition-colors"
                >
                  Ver todas
                </Link>
              </div>

              <div className="divide-y divide-white/10">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No hay órdenes registradas aún.
                  </div>
                ) : (
                  orders.map((o) => (
                    <OrderRow
                      key={o.id}
                      id={o.id}
                      number={o.number.toString().padStart(5, "0")}
                      customer={o.customer.name}
                      work={o.type}
                      status={o.status}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  desc,
}: {
  label: string;
  value: number;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(30,41,59,0.06)] p-5 transition-all hover:shadow-[0_14px_40px_rgba(30,41,59,0.1)] hover:-translate-y-0.5">
      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-400">{desc}</p>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 font-semibold text-[10px] uppercase tracking-wide">Finalizada</Badge>;
    case "IN_PROGRESS":
      return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 font-semibold text-[10px] uppercase tracking-wide">En proceso</Badge>;
    case "CANCELLED":
      return <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200 font-semibold text-[10px] uppercase tracking-wide">Cancelada</Badge>;
    default:
      return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 font-semibold text-[10px] uppercase tracking-wide">Pendiente</Badge>;
  }
}

function OrderRow({
  id,
  number,
  customer,
  work,
  status,
}: {
  id: string;
  number: string;
  customer: string;
  work: string;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/40 transition-colors">
      <div className="flex items-center gap-4">
        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-black text-indigo-700 shadow-sm sm:flex shadow-indigo-100/50">
          #{number.slice(-2)}
        </div>

        <div>
          <p className="font-bold text-slate-800">{customer}</p>
          <p className="text-sm text-slate-400 font-medium">{work}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="text-xs font-mono font-semibold text-slate-300 tracking-wide">#{number}</span>
        <div className="flex items-center gap-2">
          {getStatusBadge(status)}
          <DeleteButton id={id} />
        </div>
      </div>
    </div>
  );
}
