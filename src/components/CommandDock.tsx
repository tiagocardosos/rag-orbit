import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderOpen, FileText, Scissors, Search,
  MessageSquare, FlaskConical, BarChart3, Star,
} from "lucide-react";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Coleções", url: "/colecoes", icon: FolderOpen },
  { title: "Documentos", url: "/documentos", icon: FileText },
  { title: "Chunking Lab", url: "/chunking-lab", icon: Scissors },
  { title: "Busca", url: "/busca", icon: Search },
  { title: "RAG Chat", url: "/chat", icon: MessageSquare },
  { title: "Experimentos", url: "/experimentos", icon: FlaskConical },
  { title: "Resultados", url: "/resultados", icon: BarChart3 },
  { title: "Golden Set", url: "/golden-set", icon: Star },
];

export function CommandDock() {
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={200}>
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-2xl dock-glass md:bottom-6">
        {items.map((item) => {
          const isActive = item.url === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.url);

          return (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link
                  to={item.url}
                  className={`dock-tile group relative flex items-center justify-center w-11 h-11 md:w-[52px] md:h-[52px] rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "border-primary/60 bg-primary/15 glow-neon-strong"
                      : "border-border/40 bg-secondary/30 hover:border-primary/40 hover:bg-primary/10 hover:scale-110"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 md:h-[22px] md:w-[22px] transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse-glow" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-xs">
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
