import { Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsTabletOrSmaller } from "@/hooks/use-mobile";

export function AppLayout() {
  const isSmallScreen = useIsTabletOrSmaller();

  return (
    <SidebarProvider defaultOpen={!isSmallScreen}>
      <div className="min-h-screen flex w-full bg-grid-pattern">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 glass">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
