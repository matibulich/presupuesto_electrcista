import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WorkOrderForm from "@/components/orders/WorkOrdersForm";


import { prisma } from "@/lib/prisma";

type EditOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditOrderPage({
  params,
}: EditOrderPageProps) {
  const { id } = await params;

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
    notFound();
  }

  const initialData = {
    customerName: order.customer.name,
    phone: order.customer.phone,
    address: order.customer.address ?? "",
    workType: order.type,
    description: order.description,
    observations: order.observations ?? "",
    budget: order.budget ?? undefined,
    priority: order.priority,

    materials: order.materials.map((material) => ({
      description: material.description,
      quantity: String(material.quantity),
      unit: material.unit ?? "",
      price: material.price ?? undefined,
    })),
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <WorkOrderForm
            mode="edit"
            orderId={order.id}
            initialData={initialData}
          />
        </main>
      </div>
    </div>
  );
}