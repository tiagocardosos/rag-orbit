import type { Collection, Document, Chunk, Experiment, GoldenQuestion, SearchResult, ChatMessage } from '@/lib/types';

export const mockCollections: Collection[] = [
  { id: "col-001", name: "EMBRAPII Fixed-Size", description: "Documentos EMBRAPII com chunking fixed-size 512/50", created_at: "2025-03-10", document_count: 3 },
  { id: "col-002", name: "EMBRAPII Recursive", description: "Documentos EMBRAPII com chunking recursive 512/50", created_at: "2025-03-11", document_count: 3 },
  { id: "col-003", name: "EMBRAPII Sentence", description: "Documentos EMBRAPII com chunking sentence 512", created_at: "2025-03-12", document_count: 3 },
  { id: "col-004", name: "EMBRAPII Semantic", description: "Documentos EMBRAPII com chunking semantic p25", created_at: "2025-03-13", document_count: 3 },
  { id: "col-005", name: "Lattes Structure-Aware", description: "Currículos Lattes com structure-aware chunking", created_at: "2025-03-14", document_count: 23 },
];

export const mockDocuments: Document[] = [
  { id: "doc-001", filename: "manual_operacao_embrapii_v6.pdf", doc_type: "pdf", collection: "EMBRAPII Fixed-Size", strategy: "fixed_size", total_chunks: 245, created_at: "2025-03-10" },
  { id: "doc-002", filename: "codigo_etica_agosto_2019.pdf", doc_type: "pdf", collection: "EMBRAPII Fixed-Size", strategy: "fixed_size", total_chunks: 68, created_at: "2025-03-10" },
  { id: "doc-003", filename: "regimento_comite_etica.pdf", doc_type: "pdf", collection: "EMBRAPII Fixed-Size", strategy: "fixed_size", total_chunks: 92, created_at: "2025-03-10" },
  { id: "doc-004", filename: "2429856261320761.json", doc_type: "json_lattes", collection: "Lattes Structure-Aware", strategy: "structure_aware", total_chunks: 47, created_at: "2025-03-14" },
];

export const mockChunks: Chunk[] = [
  { chunk_index: 0, content: "MANUAL DE OPERAÇÃO EMBRAPII\n\n1. INTRODUÇÃO\n\n1.1 Objetivo\nEste Manual de Operação tem por objetivo estabelecer as normas, procedimentos e critérios operacionais para o funcionamento da EMBRAPII...", metadata: { strategy: "fixed_size", char_start: 0, char_end: 512 } },
  { chunk_index: 1, content: "...credenciamento de Unidades EMBRAPII. As Unidades credenciadas devem atender aos requisitos mínimos de infraestrutura, equipe técnica qualificada e capacidade de execução de projetos de PD&I...", metadata: { strategy: "fixed_size", char_start: 462, char_end: 974 } },
  { chunk_index: 2, content: "1.2 Abrangência\nO presente Manual se aplica a todas as Unidades EMBRAPII credenciadas, em processo de credenciamento, e às empresas parceiras que desenvolvam projetos no âmbito do modelo EMBRAPII...", metadata: { strategy: "fixed_size", char_start: 924, char_end: 1436 } },
];

export const mockExperiments: Experiment[] = [
  { id: "exp-001", name: "Fixed-Size 512/50 EMBRAPII", collection: "EMBRAPII Fixed-Size", strategy: "fixed_size", status: "completed", total_questions: 231, avg_faithfulness: 0.847, avg_answer_relevancy: 0.691, avg_context_precision: 0.876, avg_context_recall: 0.723, avg_answer_correctness: 0.638, avg_mrr: 0.0, created_at: "2025-03-15" },
  { id: "exp-002", name: "Recursive 512/50 EMBRAPII", collection: "EMBRAPII Recursive", strategy: "recursive", status: "completed", total_questions: 231, avg_faithfulness: 0.891, avg_answer_relevancy: 0.720, avg_context_precision: 0.854, avg_context_recall: 0.756, avg_answer_correctness: 0.651, avg_mrr: 0.0, created_at: "2025-03-16" },
  { id: "exp-003", name: "Sentence 512 EMBRAPII", collection: "EMBRAPII Sentence", strategy: "sentence", status: "completed", total_questions: 231, avg_faithfulness: 0.878, avg_answer_relevancy: 0.721, avg_context_precision: 0.893, avg_context_recall: 0.812, avg_answer_correctness: 0.679, avg_mrr: 0.0, created_at: "2025-03-17" },
  { id: "exp-004", name: "Semantic p25 EMBRAPII", collection: "EMBRAPII Semantic", strategy: "semantic", status: "completed", total_questions: 231, avg_faithfulness: 0.862, avg_answer_relevancy: 0.729, avg_context_precision: 0.867, avg_context_recall: 0.789, avg_answer_correctness: 0.609, avg_mrr: 0.0, created_at: "2025-03-18" },
];

export const mockRecentExperiments = [
  { name: "Exp Fixed-Size 512", strategy: "fixed_size" as const, status: "completed" as const, avg_answer_correctness: 0.638, created_at: "2025-03-15" },
  { name: "Exp Recursive 512", strategy: "recursive" as const, status: "completed" as const, avg_answer_correctness: 0.651, created_at: "2025-03-16" },
  { name: "Exp Sentence 512", strategy: "sentence" as const, status: "completed" as const, avg_answer_correctness: 0.679, created_at: "2025-03-17" },
  { name: "Exp Semantic 512", strategy: "semantic" as const, status: "running" as const, avg_answer_correctness: null, created_at: "2025-03-18" },
];

export const mockDashboardStats = { collections: 5, documents: 8, experiments_completed: 4, golden_questions: 231 };

export const mockSearchResults: SearchResult[] = [
  { rank: 1, score: 0.92, content: "Os requisitos mínimos para credenciamento de Unidades EMBRAPII incluem: infraestrutura laboratorial adequada, equipe técnica qualificada com experiência em PD&I, capacidade comprovada de captação de projetos com empresas...", metadata: { document: "manual_operacao_embrapii_v6.pdf", strategy: "sentence", chunk_index: 34 } },
  { rank: 2, score: 0.87, content: "O processo de credenciamento envolve a submissão de proposta pela instituição candidata, análise documental, visita técnica in loco e deliberação pelo Conselho Deliberativo da EMBRAPII...", metadata: { document: "manual_operacao_embrapii_v6.pdf", strategy: "sentence", chunk_index: 35 } },
  { rank: 3, score: 0.81, content: "As Unidades credenciadas devem manter atualizado o Plano de Ação Institucional, contendo metas de projetos, indicadores de desempenho e planejamento de investimentos em infraestrutura...", metadata: { document: "manual_operacao_embrapii_v6.pdf", strategy: "sentence", chunk_index: 42 } },
  { rank: 4, score: 0.76, content: "A EMBRAPII poderá suspender ou descredenciar Unidades que não cumprirem as metas estabelecidas no Plano de Ação ou que descumprirem as normas do Manual de Operação...", metadata: { document: "manual_operacao_embrapii_v6.pdf", strategy: "sentence", chunk_index: 67 } },
  { rank: 5, score: 0.71, content: "O credenciamento tem vigência de até 6 anos, podendo ser renovado mediante avaliação de desempenho e cumprimento dos requisitos estabelecidos...", metadata: { document: "manual_operacao_embrapii_v6.pdf", strategy: "sentence", chunk_index: 36 } },
];

export const mockChatMessages: ChatMessage[] = [
  { role: "user", content: "Qual é o prazo máximo para prestação de contas de projetos EMBRAPII?" },
  { role: "assistant", content: "De acordo com o Manual de Operação EMBRAPII, o prazo máximo para prestação de contas de projetos é de **90 dias** após a conclusão do projeto. A Unidade EMBRAPII deve apresentar o relatório técnico final e a prestação de contas financeira dentro desse período, sob pena de suspensão de novos desembolsos.", context: [{ rank: 1, score: 0.94, content: "A prestação de contas de cada projeto deve ser apresentada pela Unidade EMBRAPII no prazo máximo de 90 (noventa) dias após a data de conclusão do projeto...", source: "manual_operacao_embrapii_v6.pdf" }, { rank: 2, score: 0.88, content: "O descumprimento dos prazos de prestação de contas poderá acarretar a suspensão de novos desembolsos...", source: "manual_operacao_embrapii_v6.pdf" }], latency_ms: 342 },
];

export const mockGoldenQuestions: GoldenQuestion[] = [
  { id: 1, question: "Qual o prazo máximo para credenciamento?", type: "factual", document: "Manual de Operação EMBRAPII v6", expected_answer: "O prazo máximo para credenciamento de Unidades EMBRAPII é de 6 anos..." },
  { id: 2, question: "Quais são as penalidades previstas para descumprimento do código de ética?", type: "factual", document: "Código de Ética ago/2019", expected_answer: "As penalidades incluem advertência, suspensão..." },
  { id: 3, question: "Como a evolução do modelo EMBRAPII impacta a sustentabilidade das unidades credenciadas?", type: "inferential", document: "Manual de Operação EMBRAPII v6", expected_answer: "A evolução do modelo tende a fortalecer..." },
  { id: 4, question: "Qual a composição do Comitê de Conduta Ética?", type: "factual", document: "Regimento Comitê de Conduta Ética", expected_answer: "O Comitê é composto por 5 membros..." },
  { id: 5, question: "De que forma o processo de apuração ética equilibra celeridade e direito de defesa?", type: "inferential", document: "Regimento Comitê de Conduta Ética", expected_answer: "O processo equilibra através de prazos definidos..." },
  { id: 6, question: "Quais são os critérios de avaliação de projetos EMBRAPII?", type: "factual", document: "Manual de Operação EMBRAPII v6", expected_answer: "Os critérios incluem mérito técnico, viabilidade econômica..." },
  { id: 7, question: "Como funciona o modelo de financiamento tripartite?", type: "factual", document: "Manual de Operação EMBRAPII v6", expected_answer: "O modelo tripartite divide os recursos entre EMBRAPII, Unidade e empresa..." },
  { id: 8, question: "Qual o papel do Conselho Deliberativo?", type: "factual", document: "Manual de Operação EMBRAPII v6", expected_answer: "O Conselho Deliberativo é responsável pela aprovação de políticas..." },
  { id: 9, question: "Como a EMBRAPII mede o impacto dos projetos?", type: "inferential", document: "Manual de Operação EMBRAPII v6", expected_answer: "O impacto é medido através de indicadores como patentes geradas..." },
  { id: 10, question: "Quais são as obrigações das empresas parceiras?", type: "factual", document: "Manual de Operação EMBRAPII v6", expected_answer: "As empresas devem aportar contrapartida financeira mínima..." },
];

export const mockChunkingLabStats = {
  fixed_size: { total_chunks: 245, avg_size: 498, min_size: 312, max_size: 512, median_size: 510 },
  recursive: { total_chunks: 198, avg_size: 623, min_size: 89, max_size: 1024, median_size: 587 },
  sentence: { total_chunks: 178, avg_size: 689, min_size: 45, max_size: 1156, median_size: 645 },
  semantic: { total_chunks: 142, avg_size: 867, min_size: 123, max_size: 2048, median_size: 812 },
};

export const mockResultsHeatmap = [
  { strategy: "fixed_size", faithfulness: "1.000 (0.317)", answer_relevancy: "0.691 (0.305)", context_precision: "0.950 (0.244)", context_recall: "1.000 (1.000)", answer_correctness: "0.638 (0.555)", mrr: "0.000 (1.000)" },
  { strategy: "recursive", faithfulness: "1.000 (0.167)", answer_relevancy: "0.720 (0.272)", context_precision: "0.917 (0.250)", context_recall: "1.000 (1.000)", answer_correctness: "0.651 (0.532)", mrr: "0.000 (1.000)" },
  { strategy: "semantic", faithfulness: "1.000 (0.200)", answer_relevancy: "0.729 (0.268)", context_precision: "0.950 (0.250)", context_recall: "1.000 (0.125)", answer_correctness: "0.609 (0.508)", mrr: "0.000 (1.000)" },
  { strategy: "sentence", faithfulness: "1.000 (0.175)", answer_relevancy: "0.721 (0.269)", context_precision: "1.000 (0.244)", context_recall: "1.000 (0.000)", answer_correctness: "0.679 (0.470)", mrr: "0.000 (1.000)" },
];

export const mockWilcoxonResults = [
  { metric: "Faithfulness", pair: "Fixed-Size vs Recursive", p_value: 0.0149, winner: "Recursive", effect_size: 0.91, effect_label: "grande" },
  { metric: "Context Recall", pair: "Recursive vs Sentence", p_value: 0.0071, winner: "Sentence", effect_size: 0.98, effect_label: "grande" },
  { metric: "Answer Correctness", pair: "Semantic vs Sentence", p_value: 0.0015, winner: "Sentence", effect_size: 0.53, effect_label: "grande" },
];

export const mockVictoryRanking = [
  { strategy: "Sentence", wins: 2, metrics: "Context Recall, Answer Correctness" },
  { strategy: "Recursive", wins: 1, metrics: "Faithfulness" },
  { strategy: "Fixed-Size", wins: 0, metrics: "—" },
  { strategy: "Semantic", wins: 0, metrics: "—" },
];

export const mockRadarData = [
  { metric: 'Faithfulness', fixed_size: 0.847, recursive: 0.891, sentence: 0.878, semantic: 0.862 },
  { metric: 'Answer Relevancy', fixed_size: 0.691, recursive: 0.720, sentence: 0.721, semantic: 0.729 },
  { metric: 'Context Precision', fixed_size: 0.876, recursive: 0.854, sentence: 0.893, semantic: 0.867 },
  { metric: 'Context Recall', fixed_size: 0.723, recursive: 0.756, sentence: 0.812, semantic: 0.789 },
  { metric: 'Answer Correctness', fixed_size: 0.638, recursive: 0.651, sentence: 0.679, semantic: 0.609 },
  { metric: 'MRR', fixed_size: 0.0, recursive: 0.0, sentence: 0.0, semantic: 0.0 },
];

export const mockCorpusStats = {
  total_words: 187420,
  total_phrases: 12840,
  total_sentences: 8960,
  total_pages: 405,
  total_documents: 4,
  total_characters: 1124520,
  avg_chunk_size: 669,
};

export const mockGoldenStats = {
  total: 231,
  factual: 139,
  inferential: 92,
  with_expected: 231,
  by_document: [
    { document: "Regimento Comitê de Conduta Ética", total: 46, factual: 30, inferential: 16 },
    { document: "Código de Ética ago/2019", total: 35, factual: 16, inferential: 19 },
    { document: "Manual de Operação EMBRAPII v6", total: 150, factual: 93, inferential: 57 },
  ],
};
