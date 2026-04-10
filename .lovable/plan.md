

# Plano — README do Projeto + DOCS do Dashboard

## 1. Criar `README.md` na raiz do projeto

README acadêmico para o mestrado com:

- **Título**: RAG Orbit — Chunking Lab
- **Descrição**: Plataforma de experimentação e avaliação comparativa de estratégias de chunking para RAG (Retrieval-Augmented Generation), desenvolvida como parte de dissertação de mestrado.
- **Autores**: Tiago Cardoso Soares e Alan Tulio Lino Gonçalves
- **Motivação / Contexto acadêmico**: Avaliação de 5 estratégias de chunking (Fixed-Size, Recursive, Sentence, Semantic, Structure-Aware) aplicadas a documentos EMBRAPII e Currículos Lattes
- **Funcionalidades**: Listagem das páginas — Solar System overview, Coleções, Documentos, Chunking Lab, Experimentos, Resultados, Golden Set, Busca, Chat
- **Tech Stack**: TanStack Start, React 19, Tailwind CSS v4, Vite 7, shadcn/ui
- **Métricas RAGAS**: Faithfulness, Answer Relevancy, Context Precision, Context Recall, Answer Correctness
- **Como rodar**: `bun install` + `bun run dev`
- **Estrutura de diretórios** simplificada
- **Licença**: placeholder para escolha posterior

## 2. Criar `DOCS/dashboard.md`

Documentação técnica do dashboard com:

- **Visão geral**: Explicação do sistema solar como metáfora visual — sol = corpus RAG, planetas = estratégias de chunking
- **Páginas**: Descrição de cada rota e seu propósito
- **Tipos de dados**: Explicação das interfaces (Collection, Document, Chunk, Experiment, GoldenQuestion, etc.)
- **Estratégias de chunking**: Tabela com as 5 estratégias, suas cores e descrições
- **Métricas**: O que cada métrica RAGAS avalia
- **Mock data**: Explicação de que os dados são simulados, com estrutura em `src/data/mock-data.ts`
- **Componentes principais**: SolarSystem, MetricBoxPlot, CommandDock, AppLayout, AppSidebar
- **Tema visual**: Matrix Academic — cores, glassmorphism, JetBrains Mono

## Arquivos criados

1. `README.md` — raiz do projeto
2. `DOCS/dashboard.md` — documentação do dashboard

