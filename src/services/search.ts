import { apiPost } from './http'
import { API_ROUTES } from '@/lib/api-routes'
import type { RetrievalStrategy, SearchResult } from '@/lib/types'

// ⚠️ PONTO DE ATENÇÃO (BACKEND): SearchResult retorna chunk_metadata (objeto livre)
// em vez de campos tipados. O front espera metadata.document, metadata.strategy e
// metadata.chunk_index. O adapter abaixo faz o mapeamento com fallbacks.
// Sugestão: normalizar os campos em chunk_metadata no backend (document_id, chunk_index).

interface ApiSearchResult {
  chunk_id: string
  content: string
  score: number
  chunk_metadata: Record<string, unknown>
}

function toSearchResult(api: ApiSearchResult, index: number): SearchResult {
  const meta = api.chunk_metadata
  return {
    rank: index + 1,
    score: api.score,
    content: api.content,
    metadata: {
      document: String(meta?.document ?? meta?.filename ?? meta?.source ?? api.chunk_id),
      strategy: String(meta?.chunking_strategy ?? meta?.strategy ?? ''),
      chunk_index: Number(meta?.chunk_index ?? index),
    },
  }
}

export interface SearchParams {
  query: string
  collection_id: string
  retrieval_strategy?: RetrievalStrategy
  top_k?: number
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
}

export function search(params: SearchParams): Promise<SearchResponse> {
  return apiPost<{ query: string; results: ApiSearchResult[] }>(API_ROUTES.search, {
    query: params.query,
    collection_id: params.collection_id,
    retrieval_strategy: params.retrieval_strategy ?? 'semantic',
    top_k: params.top_k ?? 5,
  }).then((data) => ({
    query: data.query,
    results: data.results.map(toSearchResult),
  }))
}
