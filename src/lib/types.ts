export type ChunkingStrategy = 'fixed_size' | 'recursive' | 'sentence' | 'semantic' | 'structure_aware';
export type DocType = 'pdf' | 'xml_lattes' | 'json_lattes';
export type RetrievalStrategy = 'semantic' | 'hybrid';
export type ExperimentStatus = 'pending' | 'running' | 'completed' | 'failed';
export type QuestionType = 'factual' | 'inferential';

export const STRATEGY_COLORS: Record<ChunkingStrategy, string> = {
  fixed_size: '#ff6b6b',
  recursive: '#ffd93d',
  sentence: '#00ff41',
  semantic: '#0984e3',
  structure_aware: '#a855f7',
};

export const STRATEGY_LABELS: Record<ChunkingStrategy, string> = {
  fixed_size: 'Fixed-Size',
  recursive: 'Recursive',
  sentence: 'Sentence',
  semantic: 'Semantic',
  structure_aware: 'Structure-Aware',
};

export const METRIC_LABELS: Record<string, string> = {
  faithfulness: 'Faithfulness',
  answer_relevancy: 'Answer Relevancy',
  context_precision: 'Context Precision',
  context_recall: 'Context Recall',
  answer_correctness: 'Answer Correctness',
  mrr: 'MRR',
};

export const STATUS_COLORS: Record<ExperimentStatus, string> = {
  pending: '#ffd93d',
  running: '#38bdf8',
  completed: '#00ff41',
  failed: '#ff6b6b',
};

export interface Collection {
  id: string;
  name: string;
  description: string;
  created_at: string;
  document_count: number;
}

export interface Document {
  id: string;
  filename: string;
  doc_type: DocType;
  collection: string;
  strategy: ChunkingStrategy;
  total_chunks: number;
  created_at: string;
}

export interface Chunk {
  chunk_index: number;
  content: string;
  metadata: Record<string, unknown>;
}

export interface Experiment {
  id: string;
  name: string;
  collection: string;
  strategy: ChunkingStrategy;
  status: ExperimentStatus;
  total_questions: number;
  avg_faithfulness: number;
  avg_answer_relevancy: number;
  avg_context_precision: number;
  avg_context_recall: number;
  avg_answer_correctness: number;
  avg_mrr?: number;
  created_at: string;
}

export interface GoldenQuestion {
  id: number;
  question: string;
  type: QuestionType;
  document: string;
  expected_answer: string;
}

export interface SearchResult {
  rank: number;
  score: number;
  content: string;
  metadata: { document: string; strategy: string; chunk_index: number };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  context?: { rank: number; score: number; content: string; source: string }[];
  latency_ms?: number;
}
