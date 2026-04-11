import { apiPost } from './http'
import { API_ROUTES } from '@/lib/api-routes'
import type { RetrievalStrategy } from '@/lib/types'

interface ApiSearchResult {
  chunk_id: string
  content: string
  score: number
  chunk_metadata: Record<string, unknown>
}

export interface ChatContext {
  rank: number
  score: number
  content: string
  source: string
}

export interface ChatResponse {
  answer: string
  context: ChatContext[]
  latency_ms: number
}

export interface ChatParams {
  query: string
  collection_id: string
  retrieval_strategy?: RetrievalStrategy
  top_k?: number
  generator_model?: string
}

export function ragChat(params: ChatParams): Promise<ChatResponse> {
  return apiPost<{ query: string; answer: string; context: ApiSearchResult[]; latency_ms: number }>(
    API_ROUTES.rag.chat,
    {
      query: params.query,
      collection_id: params.collection_id,
      retrieval_strategy: params.retrieval_strategy ?? 'semantic',
      top_k: params.top_k ?? 5,
      generator_model: params.generator_model ?? null,
    },
  ).then((data) => ({
    answer: data.answer,
    context: data.context.map((c, i) => ({
      rank: i + 1,
      score: c.score,
      content: c.content,
      source: String(c.chunk_metadata?.document ?? c.chunk_metadata?.filename ?? c.chunk_id),
    })),
    latency_ms: data.latency_ms,
  }))
}
