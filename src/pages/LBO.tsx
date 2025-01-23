import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LBOModel } from "@/components/LBOModel";

const LBO = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <SidebarTrigger />
            <LBOModel />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LBO;