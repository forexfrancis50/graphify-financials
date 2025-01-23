import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <SidebarTrigger />
            <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">Financial Modeling App</h1>
                <p className="text-xl text-gray-600">
                  Select a model type from the sidebar to get started
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;