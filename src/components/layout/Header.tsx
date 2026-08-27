export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Gestión
        </p>

        <h2 className="text-lg font-semibold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted md:hidden"
        >
          ☰
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">
            Usuario
          </p>

          <p className="text-xs text-muted-foreground">
            Administrador
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          U
        </div>
      </div>
    </header>
  );
}