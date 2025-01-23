import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DCFModel } from "@/components/DCFModel";

const DCF = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <SidebarTrigger />
            <DCFModel />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DCF;