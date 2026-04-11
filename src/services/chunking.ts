import { apiPostForm } from './http'
import { API_ROUTES } from '@/lib/api-routes'
import type { ChunkingStrategy } from '@/lib/types'

export interface ChunkPreviewParams {
  file: File
  chunking_strategy: ChunkingStrategy
  chunk_size?: number
  chunk_overlap?: number
}

export interface ChunkPreviewItem {
  chunk_index: number
  content: string
  chunk_metadata: Record<string, unknown>
}

export interface ChunkPreviewResult {
  chunking_strategy: ChunkingStrategy
  total_chunks: number
  chunks: ChunkPreviewItem[]
}

export function previewChunks(params: ChunkPreviewParams): Promise<ChunkPreviewResult> {
  const form = new FormData()
  form.append('file', params.file)
  form.append('chunking_strategy', params.chunking_strategy)
  if (params.chunk_size !== undefined) form.append('chunk_size', String(params.chunk_size))
  if (params.chunk_overlap !== undefined) form.append('chunk_overlap', String(params.chunk_overlap))
  return apiPostForm<ChunkPreviewResult>(API_ROUTES.chunking.preview, form)
}
