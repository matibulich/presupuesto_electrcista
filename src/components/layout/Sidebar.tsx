"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: "⌂",
  },
  {
    name: "Órdenes",
    href: "/ordenes",
    icon: "▤",
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: "♙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 md:flex md:flex-col backdrop-blur-xl bg-gradient-to-b from-white/50 to-white/30 border-r border-white/20 shadow-[0_8px_32px_0_rgba(30,41,59,0.08)]">
      {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/20 px-6 backdrop-blur-sm">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              OT Manager
            </h1>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
              Órdenes de trabajo
            </p>
          </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400/70">
          Principal
        </p>

        {navigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="w-5 text-center text-base">
                {item.icon}
              </span>

              {item.name}
            </Link>
          );
        })}

      </nav>

      {/* Usuario */}
        <div className="border-t border-white/20 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/40 p-3 backdrop-blur-md border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            U
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              Usuario
            </p>

            <p className="truncate text-xs text-muted-foreground">
              Administrador
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}