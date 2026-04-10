import { Outlet } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { CommandDock } from "@/components/CommandDock";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-grid-pattern">
      <header className="h-12 flex items-center border-b border-border px-5 glass shrink-0">
        <Brain className="h-5 w-5 text-primary mr-2" />
        <span className="font-bold text-sm text-foreground font-mono tracking-wide">
          RAG Chunking Lab
        </span>
      </header>
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-28 overflow-auto">
        <Outlet />
      </main>
      <CommandDock />
    </div>
  );
}
