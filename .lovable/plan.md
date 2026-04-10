

# RAG Sun — Corpus Stats on Hover

## Concept

When the user hovers over the central "RAG" sun, it scales up (like planets do) and reveals a detailed corpus/dataset stats panel — showing totals about the ingested PDFs/documents. The chunk count stays visible, and the new stats appear around or below the sun as a glass card.

## Corpus Stats to Display

1. **Total de Chunks** — 763 (already shown, keeps)
2. **Total de Palavras** — ~187,420
3. **Total de Frases** — ~12,840
4. **Total de Sentenças** — ~8,960
5. **Total de Páginas** — ~405
6. **Total de Documentos** — 4
7. **Total de Caracteres** — ~1,124,520
8. **Tamanho Médio de Chunk** — ~669 chars

## Interaction

- Default state: Sun shows "RAG" + "763 chunks" (current behavior)
- Hover: Sun scales 1.3x, a glass stats card fades in below/around the sun showing all corpus metrics in a terminal-style grid (two columns of key-value pairs with neon styling)
- The card uses the same glass/glow aesthetic as the planet legend

## Changes

### 1. `src/data/mock-data.ts`
- Add `mockCorpusStats` object with all the corpus-level stats (words, sentences, pages, characters, avg chunk size)

### 2. `src/components/SolarSystem.tsx`
- Add `hoveredSun` state (boolean)
- On sun `onMouseEnter`/`onMouseLeave`, toggle state
- When hovered: sun scales 1.3x with stronger glow
- Render a positioned stats card (absolute, centered below sun) that fades in with the corpus metrics
- Stats displayed as a compact 2-column grid with icons and neon-accented values

## Technical Details

- Sun hover uses `transition-all duration-300` + `scale-[1.3]` (same pattern as planets)
- Stats card: `absolute` positioned, `backdrop-blur`, `border-neon/20`, fade-in via opacity transition
- Mock values are realistic estimates based on the existing document data

