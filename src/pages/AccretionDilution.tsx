import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AccretionDilutionModel } from "@/components/AccretionDilutionModel";

const AccretionDilution = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <SidebarTrigger />
            <AccretionDilutionModel />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AccretionDilution;