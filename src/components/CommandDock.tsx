import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderOpen, FileText, Scissors, Search,
  MessageSquare, FlaskConical, BarChart3, Star,
} from "lucide-react";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";
import { useRef, useState, useCallback } from "react";

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

const BASE_SIZE = 52;
const MAX_SIZE = 72;
const INFLUENCE_RADIUS = 140; // px distance of magnification influence

export function CommandDock() {
  const location = useLocation();
  const dockRef = useRef<HTMLDivElement>(null);
  const [scales, setScales] = useState<number[]>(items.map(() => 1));

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dockRef.current) return;
    const children = dockRef.current.children;
    const newScales = items.map((_, i) => {
      const child = children[i] as HTMLElement;
      if (!child) return 1;
      const rect = child.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - centerX);
      if (dist > INFLUENCE_RADIUS) return 1;
      const ratio = 1 - dist / INFLUENCE_RADIUS;
      // cosine ease for smooth falloff
      const ease = (Math.cos((1 - ratio) * Math.PI) + 1) / 2;
      return 1 + ease * (MAX_SIZE / BASE_SIZE - 1);
    });
    setScales(newScales);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setScales(items.map(() => 1));
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-end gap-1.5 px-3 py-2 rounded-2xl dock-glass md:bottom-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={dockRef} className="flex items-end gap-1.5">
          {items.map((item, i) => {
            const isActive = item.url === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.url);

            const scale = scales[i];
            const size = BASE_SIZE * scale;

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.url}
                    className={`dock-tile group relative flex items-center justify-center rounded-xl border transition-colors duration-150 ${
                      isActive
                        ? "border-primary/60 bg-primary/15 glow-neon-strong"
                        : "border-border/40 bg-secondary/30 hover:border-primary/40 hover:bg-primary/10"
                    }`}
                    style={{
                      width: size,
                      height: size,
                      transition: "width 0.15s cubic-bezier(0.25,1,0.5,1), height 0.15s cubic-bezier(0.25,1,0.5,1)",
                    }}
                  >
                    <item.icon
                      className={`transition-colors duration-150 ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      }`}
                      style={{
                        width: 20 * scale,
                        height: 20 * scale,
                        transition: "width 0.15s cubic-bezier(0.25,1,0.5,1), height 0.15s cubic-bezier(0.25,1,0.5,1)",
                      }}
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
        </div>
      </nav>
    </TooltipProvider>
  );
}
