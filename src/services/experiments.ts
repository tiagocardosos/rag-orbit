import { apiGet, apiPost } from './http'
import { API_ROUTES } from '@/lib/api-routes'
import type { ChunkingStrategy, ExperimentStatus, RetrievalStrategy } from '@/lib/types'

// ⚠️ PONTO DE ATENÇÃO (BACKEND): ExperimentRunResponse não retorna collection_name,
// chunking_strategy nem created_at. Esses campos são exibidos na tabela de experimentos.
// Sugestão: incluir esses campos na resposta do backend.

export interface ExperimentSummary {
  experiment_id: string
  name: string
  status: ExperimentStatus
  total_questions: number
  avg_faithfulness: number | null
  avg_answer_relevancy: number | null
  avg_context_precision: number | null
  avg_context_recall: number | null
  avg_answer_correctness: number | null
  results: ExperimentResultItem[]
}

export interface ExperimentResultItem {
  question: string
  generated_answer: string
  faithfulness: number | null
  answer_relevancy: number | null
  context_precision: number | null
  context_recall: number | null
  answer_correctness: number | null
  mrr: number | null
}

export interface GoldenQuestionInput {
  question: string
  expected_answer?: string
  question_type?: string
}

export interface RunExperimentParams {
  name: string
  collection_id: string
  chunking_strategy: ChunkingStrategy
  retrieval_strategy?: RetrievalStrategy
  top_k?: number
  embedding_model?: string
  generator_model?: string
  golden_questions: GoldenQuestionInput[]
}

export function runExperiment(
  params: RunExperimentParams,
): Promise<{ experiment_id: string; status: ExperimentStatus; total_questions: number }> {
  return apiPost<ExperimentSummary>(API_ROUTES.experiments.run, params).then((data) => ({
    experiment_id: data.experiment_id,
    status: data.status,
    total_questions: data.total_questions,
  }))
}

export function listExperiments(collection_id?: string): Promise<ExperimentSummary[]> {
  const path = collection_id
    ? `${API_ROUTES.experiments.list}?collection_id=${encodeURIComponent(collection_id)}`
    : API_ROUTES.experiments.list
  return apiGet<ExperimentSummary[]>(path)
}

export function getExperiment(id: string): Promise<ExperimentSummary> {
  return apiGet<ExperimentSummary>(API_ROUTES.experiments.get(id))
}
