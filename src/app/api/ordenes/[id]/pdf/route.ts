import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import WorkOrderPDF from "@/components/pdf/WorkOrderPdf";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  try {
    const order = await prisma.workOrder.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        materials: true,
      },
    });

    if (!order) {
      return new Response("Orden no encontrada", {
        status: 404,
      });
    }
    
    const pdfOrder = {
      ...order,
      materials: order.materials.map((material) => ({
        ...material,
        unit: material.unit ?? "",
      })),
    };

    const pdfBuffer = await renderToBuffer(
      createElement(WorkOrderPDF, { order: pdfOrder }) as any
    );
    const pdfBody = new Uint8Array(pdfBuffer);

    return new Response(pdfBody, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="OT-${order.number
          .toString()
          .padStart(5, "0")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generando PDF:", error);

    return new Response("Error al generar el PDF", {
      status: 500,
    });
  }
}