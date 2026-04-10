

# Navigation Redesign: Bottom Command Dock

## The Concept

Replace the traditional sidebar with a **floating bottom dock** — a horizontal bar of square, glowing icon tiles fixed at the bottom center of the screen. Think: a fusion of macOS Dock + terminal command palette + Matrix HUD.

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   ⟨ Brain icon ⟩  RAG Chunking Lab      (top-left)      │
│                                                          │
│                                                          │
│                    PAGE CONTENT                          │
│                 (full width, no sidebar)                  │
│                                                          │
│                                                          │
│                                                          │
│                                                          │
│        ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
│        │▦ │ │📁│ │📄│ │✂ │ │🔍│ │💬│ │⚗ │ │📊│ │⭐│   │
│        └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘   │
│         Dashboard Coleções ...         (tooltip on hover) │
└──────────────────────────────────────────────────────────┘
```

## Visual Design

Each nav item is a **square tile** (~52×52px) with:
- Dark translucent background (`glass` effect with backdrop-blur)
- Subtle neon green border (1px, low opacity)
- Icon centered, muted color by default
- **Active state**: neon green glow border + filled background + pulse-glow animation
- **Hover state**: scale up slightly (1.1×), border brightens, icon turns neon green
- Tooltip appears above on hover showing the label (e.g., "Chunking Lab")
- The entire dock floats with rounded corners, glass background, and a subtle outer glow

## Layout Changes

1. **Remove** the sidebar entirely (AppSidebar + SidebarProvider)
2. **AppLayout** becomes a simple full-width layout:
   - Minimal top bar: just the logo "RAG Chunking Lab" on the left (no hamburger trigger needed)
   - Content area takes full width with bottom padding (~80px) to avoid dock overlap
   - The bottom dock is `fixed bottom-4 left-1/2 -translate-x-1/2 z-50`
3. **New component**: `CommandDock.tsx` — the floating bottom navigation bar

## Mobile Behavior

On mobile (<768px), the dock tiles shrink slightly (~44×44px) and the dock becomes full-width with horizontal scroll if needed. The glass background extends edge to edge.

## Files to Change

1. **Create** `src/components/CommandDock.tsx` — the new bottom navigation with square icon tiles, glass effect, glow states, and tooltips
2. **Rewrite** `src/components/AppLayout.tsx` — remove SidebarProvider, use simple layout with top bar + content + CommandDock
3. **Delete usage** of `AppSidebar.tsx` (can keep file or remove)
4. **Update** `src/styles.css` — add any new utility classes for dock glow/hover effects if needed

## Technical Details

- Each tile uses `<Link>` from TanStack Router with `useLocation` for active detection
- Tooltips via shadcn `<Tooltip>` component (already installed)
- CSS transitions for hover scale + glow intensity
- `backdrop-filter: blur(16px)` on the dock container
- Active tile gets `box-shadow: 0 0 20px oklch(0.75 0.2 145 / 0.4)` + bright border
- Bottom padding on `<main>` ensures content doesn't hide behind the dock

