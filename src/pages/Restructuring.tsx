import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RestructuringModel } from "@/components/RestructuringModel";

const Restructuring = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <SidebarTrigger />
            <RestructuringModel />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Restructuring;