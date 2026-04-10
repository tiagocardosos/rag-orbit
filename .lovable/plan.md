

# Dashboard Matrix — Sistema Planetário

## Conceito

Substituir o dashboard tradicional (cards em grid + tabela) por um **sistema solar interativo** onde o centro é o "RAG Chunking Lab" (o sol) e cada estratégia de chunking orbita como um planeta. As métricas e dados ficam organizados ao redor desse sistema, criando um visual único e impactante.

```text
                        ╭─ Stats flutuantes ─╮
                        │  5 Coleções         │
                        │  8 Documentos       │
                        ╰─────────────────────╯

              ◉ Fixed-Size
                  ╲
                    ╲        ╭───────╮
     ◉ Recursive ────── ☀ RAG LAB ────── ◉ Sentence
                    ╱        ╰───────╯
                  ╱
              ◉ Semantic

        ╭── Últimos Experimentos (terminal style) ──╮
        │ > Exp Fixed-Size 512  ████ 0.638          │
        │ > Exp Recursive 512  █████ 0.651          │
        │ > Exp Sentence 512   ██████ 0.679         │
        │ > Exp Semantic 512   ▓▓▓▓ running...      │
        ╰───────────────────────────────────────────╯
```

## Layout da Página

A página se divide em duas zonas principais:

### Zona 1 — Sistema Planetário (hero, ~55% da altura)

- **Sol central**: círculo com glow neon forte, label "RAG Lab", pulsando suavemente
- **4 planetas orbitando** (um por estratégia), cada um na sua cor (`STRATEGY_COLORS`):
  - Fixed-Size (vermelho coral) — órbita menor
  - Recursive (amarelo ouro) — segunda órbita
  - Sentence (verde neon) — terceira órbita, maior (é a vencedora)
  - Semantic (azul elétrico) — quarta órbita
- **Órbitas visíveis** como elipses tracejadas em verde neon com opacidade baixa
- **Planetas animados** com CSS `@keyframes` orbitando lentamente (20-40s por volta), cada um em velocidade diferente
- **Hover no planeta**: ele para de orbitar, cresce (scale 1.3), e um tooltip/card aparece com as métricas médias daquela estratégia (Faithfulness, Answer Correctness, etc.)
- **Click no planeta**: navega para `/resultados` filtrado por aquela estratégia
- **Estatísticas flutuantes** nos 4 cantos do sistema solar (como HUD de nave):
  - Canto superior-esquerdo: `5 Coleções`
  - Canto superior-direito: `8 Documentos`
  - Canto inferior-esquerdo: `4 Experimentos`
  - Canto inferior-direito: `231 Golden Questions`
  - Cada stat com ícone, valor grande, label pequena, e um leve glow

### Zona 2 — Terminal de Atividade (abaixo, ~45%)

Duas colunas lado a lado:

**Coluna esquerda — "Mission Log" (Últimos Experimentos)**:
- Estilizado como terminal (fundo #0a0a0a, texto verde mono)
- Cada experimento como uma linha de log:
  ```
  [2025-03-15] ▸ Exp Fixed-Size 512  ██████░░░░ 0.638  ✓ completed
  [2025-03-16] ▸ Exp Recursive 512   ███████░░░ 0.651  ✓ completed
  [2025-03-17] ▸ Exp Sentence 512    ████████░░ 0.679  ✓ completed
  [2025-03-18] ▸ Exp Semantic 512    ░░░░░░░░░░  —     ◉ running
  ```
- Barra de progresso inline para o score, status com ícone animado para "running"

**Coluna direita — "Quick Launch" (Ações Rápidas)**:
- 3 botões grandes estilo terminal/hacker com borda neon:
  - `> nova_ingestao` → /documentos
  - `> rodar_experimento` → /experimentos
  - `> ver_resultados` → /resultados
- Cada botão com efeito de digitação (cursor piscando) no hover

## Implementação Técnica

### Animações de Órbita (CSS puro)
- Cada planeta usa `@keyframes orbit-N` com `transform: rotate() translateX() rotate()`
- Velocidades: 25s, 30s, 35s, 40s — movimento contínuo e suave
- `animation-play-state: paused` no hover para "congelar" o planeta

### Componente SVG/CSS do Sistema Solar
- Container relativo centralizado com aspect-ratio 1/1
- Órbitas como `border-radius: 50%` com border tracejado
- Planetas como divs absolutas com animação de órbita
- Sol central com múltiplas camadas de box-shadow para glow intenso

### Responsividade
- Desktop: sistema solar lado a lado com terminal
- Tablet: sistema solar em cima, terminal embaixo
- Mobile: planetas menores, órbitas compactadas, terminal em coluna única

## Arquivos

1. **Reescrever** `src/routes/_layout/index.tsx` — novo layout completo
2. **Criar** `src/components/SolarSystem.tsx` — componente do sistema planetário com órbitas, planetas e HUD stats
3. **Atualizar** `src/styles.css` — adicionar keyframes de órbita, estilos de terminal log, e animações de glow para o sol

