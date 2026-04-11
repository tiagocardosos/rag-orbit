import { apiGet } from './http'
import { API_ROUTES } from '@/lib/api-routes'

export interface CorpusStats {
  total_documents: number
  total_chunks: number
  total_words: number
  total_unique_words: number
  total_sentences: number
  total_phrases: number
  total_characters: number
  total_pages: number
  avg_chunk_size: number
}

export interface StrategyStats {
  strategy: string
  total_chunks: number
  document_count: number
  avg_faithfulness: number
  avg_answer_relevancy: number
  avg_context_precision: number
  avg_context_recall: number
  avg_answer_correctness: number
}

export interface RecentExperiment {
  name: string
  strategy: string
  status: string
  avg_answer_correctness: number | null
  created_at: string
}

export interface DashboardData {
  total_collections: number
  total_documents: number
  total_experiments: number
  total_golden_questions: number
  corpus_stats: CorpusStats
  strategy_stats: StrategyStats[]
  recent_experiments: RecentExperiment[]
}

export function fetchDashboard(): Promise<DashboardData> {
  return apiGet<DashboardData>(API_ROUTES.dashboard)
}
