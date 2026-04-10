import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderOpen, FileText, Scissors, Search,
  MessageSquare, FlaskConical, BarChart3, Star, Brain,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Coleções", url: "/colecoes", icon: FolderOpen },
  { title: "Documentos", url: "/documentos", icon: FileText },
  { title: "Chunking Lab", url: "/chunking-lab", icon: Scissors },
  { title: "Busca Semântica", url: "/busca", icon: Search },
  { title: "RAG Chat", url: "/chat", icon: MessageSquare },
  { title: "Experimentos", url: "/experimentos", icon: FlaskConical },
  { title: "Resultados", url: "/resultados", icon: BarChart3 },
  { title: "Golden Set", url: "/golden-set", icon: Star },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
        <Brain className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-bold text-sm text-foreground whitespace-nowrap">
            RAG Orbit
          </span>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
