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

const secondaryNavigation = [
  {
    name: "Configuración",
    href: "/configuracion",
    icon: "⚙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-white md:flex md:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            OT Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Órdenes de trabajo
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Principal
        </p>

        {navigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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

        <div className="my-5 border-t" />

        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sistema
        </p>

        {secondaryNavigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
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