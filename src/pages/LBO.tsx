import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const LBO = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <SidebarTrigger />
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-primary">LBO Model</h1>
              <p className="text-gray-600 mt-4">
                LBO model implementation coming in the next iteration
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LBO;