"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { deleteWorkOrder } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta orden definitivamente?")) return;
    setLoading(true);
    await deleteWorkOrder(id);
    window.location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 transition-colors disabled:opacity-50"
      title="Eliminar orden"
    >
      <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="size-3.5" />
      <span className="hidden sm:inline">Eliminar</span>
    </button>
  );
}
