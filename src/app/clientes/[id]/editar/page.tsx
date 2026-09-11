import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CustomerForm from "@/components/orders/CustomerForm";

import { prisma } from "@/lib/prisma";

type EditCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    notFound();
  }

  const initialData = {
    name: customer.name,
    phone: customer.phone,
    address: customer.address ?? "",
    notes: customer.notes ?? "",
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <CustomerForm mode="edit" initialData={initialData} customerId={customer.id} />
        </main>
      </div>
    </div>
  );
}
