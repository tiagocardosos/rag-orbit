# RAG Orbit — Documentação do Dashboard

## Visão Geral

O dashboard do RAG Orbit utiliza uma **metáfora de sistema solar** para representar visualmente o ecossistema de chunking e avaliação RAG:

- **Sol** = Corpus RAG (centro gravitacional — o conjunto de documentos)
- **Planetas** = Estratégias de chunking (orbitando o corpus, cada uma com características próprias)
- **Órbitas** = Proximidade ao centro indica relação com o corpus
- **Tamanho do planeta** = Proporcional ao número de chunks gerados pela estratégia

Ao passar o mouse sobre um planeta, o painel lateral exibe as métricas RAGAS daquela estratégia com sparklines comparativos.

---

## Páginas da Aplicação

| Rota | Página | Descrição |
|---|---|---|
| `/` | Dashboard | Sistema solar interativo com HUD de estatísticas e log de experimentos recentes |
| `/colecoes` | Coleções | Lista de coleções de documentos organizadas por estratégia de chunking |
| `/documentos` | Documentos | Tabela de documentos indexados com tipo, coleção e total de chunks |
| `/chunking-lab` | Chunking Lab | Comparação de estatísticas de chunking (total, média, min, max, mediana) por estratégia |
| `/busca` | Busca Semântica | Interface para executar buscas vetoriais e visualizar os chunks recuperados com scores |
| `/chat` | RAG Chat | Chat conversacional com o sistema RAG, mostrando contexto recuperado e latência |
| `/experimentos` | Experimentos | Lista de experimentos RAGAS com status, estratégia e métricas médias |
| `/experimentos/:id` | Detalhe do Experimento | Visão detalhada de um experimento específico |
| `/resultados` | Resultados | Análise comparativa com heatmap mediana(IQR), radar chart, box-plots e teste de Wilcoxon |
| `/golden-set` | Golden Set | Banco de 231 perguntas de avaliação (factuais e inferenciais) com respostas esperadas |

---

## Tipos de Dados

### Interfaces Principais (`src/lib/types.ts`)

#### `Collection`
Representa uma coleção de documentos indexados com uma estratégia específica.

```typescript
interface Collection {
  id: string;
  name: string;
  description: string;
  created_at: string;
  document_count: number;
}
```

#### `Document`
Um documento individual dentro de uma coleção.

```typescript
interface Document {
  id: string;
  filename: string;
  doc_type: 'pdf' | 'xml_lattes' | 'json_lattes';
  collection: string;
  strategy: ChunkingStrategy;
  total_chunks: number;
  created_at: string;
}
```

#### `Chunk`
Um segmento de texto gerado pelo processo de chunking.

```typescript
interface Chunk {
  chunk_index: number;
  content: string;
  metadata: Record<string, unknown>;
}
```

#### `Experiment`
Um experimento de avaliação RAGAS executado sobre uma coleção.

```typescript
interface Experiment {
  id: string;
  name: string;
  collection: string;
  strategy: ChunkingStrategy;
  status: 'pending' | 'running' | 'completed' | 'failed';
  total_questions: number;
  avg_faithfulness: number;
  avg_answer_relevancy: number;
  avg_context_precision: number;
  avg_context_recall: number;
  avg_answer_correctness: number;
  avg_mrr?: number;
  created_at: string;
}
```

#### `GoldenQuestion`
Uma pergunta do golden set de avaliação.

```typescript
interface GoldenQuestion {
  id: number;
  question: string;
  type: 'factual' | 'inferential';
  document: string;
  expected_answer: string;
}
```

---

## Estratégias de Chunking

| Estratégia | Cor | Código | Descrição |
|---|---|---|---|
| Fixed-Size | 🔴 `#ff6b6b` | `fixed_size` | Segmentos de tamanho fixo com sobreposição configurável |
| Recursive | 🟡 `#ffd93d` | `recursive` | Divisão recursiva por hierarquia de separadores |
| Sentence | 🟢 `#00ff41` | `sentence` | Segmentação por sentenças completas |
| Semantic | 🔵 `#0984e3` | `semantic` | Agrupamento por similaridade semântica |
| Structure-Aware | 🟣 `#a855f7` | `structure_aware` | Respeita a estrutura lógica do documento |

---

## Métricas RAGAS

| Métrica | Chave | Intervalo | O que avalia |
|---|---|---|---|
| Faithfulness | `faithfulness` | 0–1 | A resposta é suportada pelo contexto recuperado? |
| Answer Relevancy | `answer_relevancy` | 0–1 | A resposta é relevante para a pergunta? |
| Context Precision | `context_precision` | 0–1 | Os chunks mais relevantes estão ranqueados no topo? |
| Context Recall | `context_recall` | 0–1 | O contexto recuperado cobre a informação necessária? |
| Answer Correctness | `answer_correctness` | 0–1 | A resposta está correta comparada à resposta esperada? |
| MRR | `mrr` | 0–1 | Posição média do primeiro resultado relevante |

---

## Dados Mock

Todos os dados exibidos na aplicação são **simulados** e definidos em `src/data/mock-data.ts`. Não há integração com backend real nesta versão.

### Datasets disponíveis

| Export | Descrição |
|---|---|
| `mockCollections` | 5 coleções (uma por estratégia) |
| `mockDocuments` | 4 documentos (3 PDFs EMBRAPII + 1 JSON Lattes) |
| `mockChunks` | 3 chunks de exemplo do manual EMBRAPII |
| `mockExperiments` | 4 experimentos completos com métricas médias |
| `mockRecentExperiments` | Últimos 4 experimentos para o dashboard |
| `mockDashboardStats` | Contadores agregados (coleções, docs, experimentos, perguntas) |
| `mockSearchResults` | 5 resultados de busca semântica com scores |
| `mockChatMessages` | Conversa de exemplo com contexto e latência |
| `mockGoldenQuestions` | 10 perguntas do golden set (amostra das 231) |
| `mockChunkingLabStats` | Estatísticas de chunking por estratégia |
| `mockResultsHeatmap` | Dados para heatmap mediana(IQR) |
| `mockWilcoxonResults` | 3 pares com diferença estatística significativa |
| `mockVictoryRanking` | Ranking de vitórias por estratégia |
| `mockRadarData` | Dados para radar chart comparativo |
| `mockCorpusStats` | Estatísticas gerais do corpus |
| `mockGoldenStats` | Distribuição das perguntas por tipo e documento |

---

## Componentes Principais

### `SolarSystem`
Visualização central do dashboard. Renderiza um sistema solar animado com:
- Campo de estrelas (partículas aleatórias)
- Sol pulsante no centro (representa o corpus)
- Planetas em órbita (um por estratégia avaliada)
- HUD com estatísticas agregadas
- Painel lateral com métricas expandíveis e sparklines

### `MetricBoxPlot`
Gráfico SVG customizado que renderiza box-plots horizontais para comparação de métricas entre estratégias. Exibe min, Q1, mediana, Q3 e max com cores por estratégia.

### `CommandDock`
Dock de navegação flutuante fixo na parte inferior da tela. Implementa efeito de magnificação (inspirado no macOS Dock) baseado na distância do mouse.

### `AppSidebar`
Sidebar colapsável com navegação para todas as páginas. Usa o componente Sidebar do shadcn/ui com estado `collapsed`/`expanded`.

### `AppLayout`
Layout wrapper que adiciona o header com título da aplicação e breadcrumb contextual.

---

## Tema Visual: Matrix Academic

O tema combina estética "Matrix" (terminal, neon, fundo escuro) com elementos acadêmicos.

### Tokens principais

| Token | Valor | Uso |
|---|---|---|
| Background | `oklch(0.13 ...)` | Fundo principal da aplicação |
| Primary (neon green) | `oklch(0.75 0.2 145)` | Acentos, glow, elementos interativos |
| Foreground | Branco/cinza claro | Texto principal |
| Cards | Glassmorphism | `backdrop-blur` + bordas translúcidas |
| Font (terminal) | JetBrains Mono | Elementos de código e dados |

### Efeitos visuais
- **Glassmorphism**: Cards com `backdrop-blur`, fundo semi-transparente e bordas sutis
- **Glow**: Sombras coloridas em elementos interativos (`box-shadow` com cor da estratégia)
- **Animações**: Hover suave nos planetas, transições em badges e botões
- **Star field**: Partículas animadas no fundo do dashboard
