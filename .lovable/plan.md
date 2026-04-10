

# RAG Chunking Lab — Frontend com Dados Mockados

## Visão Geral
Dashboard de pesquisa para avaliação comparativa de estratégias de chunking em RAG, com tema "Matrix Acadêmico" (dark, verde neon, glassmorphism). 10 páginas com dados 100% mockados, navegação funcional via sidebar retrátil e visualizações ricas.

## Tema Visual
- Fundo escuro (#1a1a2e, #16213e), texto claro, verde neon (#00ff41) como accent primário
- Glassmorphism em cards (backdrop-blur, bordas verdes com glow sutil)
- Tipografia: Inter para corpo, JetBrains Mono para código/terminal
- Background com grid/dots pattern sutil (~5% opacidade)
- Status badges com glow animado (running = verde pulsante)
- Cores por estratégia: Fixed-Size=#ff6b6b, Recursive=#ffd93d, Sentence=#00ff41, Semantic=#0984e3, Structure-Aware=#a855f7

## Estrutura e Navegação
- Sidebar esquerda retrátil com logo "RAG Chunking Lab" e 9 itens de menu (Lucide icons)
- Header com breadcrumb e título da página
- Layout responsivo (desktop-first, sidebar colapsa <1024px)

## Páginas

### 1. Dashboard (/)
4 stat cards (Coleções, Documentos, Experimentos, Golden Questions) + tabela de últimos experimentos + mini gráfico radar comparativo + 3 botões de ação rápida

### 2. Coleções (/colecoes)
Grid de cards (3 colunas) com CRUD mockado. Modal para criar nova coleção. Botões ver documentos e deletar com confirmação.

### 3. Documentos (/documentos)
Seção superior: drag-and-drop upload + selects de coleção/estratégia + parâmetros dinâmicos por estratégia. Seção inferior: tabela de documentos ingeridos. Modal "Ver Chunks" com cards estilo terminal (fundo #0a0a0a, texto verde mono).

### 4. Chunking Lab (/chunking-lab)
Upload + seleção múltipla de estratégias + preview comparativo lado a lado com chunks estilo terminal. Tabela de estatísticas comparativas (total chunks, média/min/max/mediana chars).

### 5. Busca Semântica (/busca)
Barra de busca destacada + selects (coleção, estratégia, top_k). Resultados como cards rankeados com score de similaridade (barra de progresso verde) e metadata.

### 6. RAG Chat (/chat)
Interface estilo ChatGPT com sidebar de configuração colapsável. Mensagens com contexto recuperado em accordion + badge de latência. Input fixo na parte inferior.

### 7. Experimentos (/experimentos)
Duas abas: "Novo Experimento" (formulário completo + upload golden questions) e "Meus Experimentos" (tabela com status, métricas médias, link para detalhes).

### 8. Resultados (/resultados) — Página principal
- Seletor multi-experimentos
- Tabela heatmap (mediana + IQR) com intensidade de cor
- Gráfico Radar (spider chart, 6 métricas × 4 estratégias)
- 6 Box Plots em grid 2×3
- Tabela Wilcoxon (comparações significativas, p-values, tamanho de efeito)
- Ranking de vitórias (placar com troféu)
- Barras agrupadas (medianas por métrica)
- Tabela paginada de resultados por pergunta com mini barras

### 9. Golden Set (/golden-set)
Stats + donut chart (factual vs inferential) + cards por documento com bar chart horizontal + tabela completa com filtros/busca/paginação + upload com validação.

### 10. Detalhe do Experimento (/experimentos/:id)
Header com status + card de configuração (grid 2 cols) + 6 gauge/progress rings de métricas + tabela de resultados por pergunta com escala de cores e linhas expansíveis.

## Dados e Interações
- Todos os dados em arquivos de mock separados (src/data/)
- Filtros, ordenação e paginação funcionais sobre dados mock
- Modais abrem/fecham, tabs alternam, toasts de feedback (sonner)
- Loading states simulados com setTimeout (1-2s)
- Empty states elegantes em todas as páginas

## Dependências Necessárias
- Recharts (gráficos: radar, bar, box plot, donut, progress)
- @fontsource/jetbrains-mono (tipografia terminal)

