import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WorkOrderForm from "@/components/orders/WorkOrdersForm";
export const dynamic = "force-dynamic";

export default function NewOrderPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <WorkOrderForm mode="create" />
        </main>
      </div>
    </div>
  );
}