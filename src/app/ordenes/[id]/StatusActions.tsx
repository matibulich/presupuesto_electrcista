"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { updateWorkOrderStatus } from "../actions";

type StatusActionsProps = {
  id: string;
  status: string;
};

export default function StatusActions({
  id,
  status,
}: StatusActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const changeStatus = async (
    newStatus:
      | "PENDING"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "CANCELLED"
  ) => {
    setIsUpdating(true);

    try {
      const result = await updateWorkOrderStatus(id, newStatus);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === "PENDING") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => changeStatus("IN_PROGRESS")}
          disabled={isUpdating}
        >
          {isUpdating ? "Actualizando..." : "Iniciar trabajo"}
        </Button>

        <Button
          variant="destructive"
          onClick={() => changeStatus("CANCELLED")}
          disabled={isUpdating}
        >
          Cancelar orden
        </Button>
      </div>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => changeStatus("COMPLETED")}
          disabled={isUpdating}
        >
          {isUpdating
            ? "Actualizando..."
            : "Marcar como finalizada"}
        </Button>

        <Button
          variant="destructive"
          onClick={() => changeStatus("CANCELLED")}
          disabled={isUpdating}
        >
          Cancelar orden
        </Button>
      </div>
    );
  }

  return null;
}