import { apiGet, apiPostForm } from './http'
import { API_ROUTES } from '@/lib/api-routes'
import type { Chunk, ChunkingStrategy } from '@/lib/types'

export interface CollectionDocument {
  id: string
  collection_id: string
  filename: string
  doc_type: string
  chunking_strategy: ChunkingStrategy
  chunk_size: number | null
  chunk_overlap: number | null
  total_chunks: number
  created_at: string
}

export function listCollectionDocuments(collectionId: string): Promise<CollectionDocument[]> {
  return apiGet<CollectionDocument[]>(API_ROUTES.collections.documents(collectionId))
}

export interface IngestParams {
  file: File
  collection_id: string
  chunking_strategy: ChunkingStrategy
  chunk_size?: number
  chunk_overlap?: number
}

export interface IngestResult {
  document_id: string
  filename: string
  doc_type: string
  total_chunks: number
  preview: Array<{
    chunk_index: number
    content: string
    chunk_metadata: Record<string, unknown>
  }>
}

export function ingestDocument(params: IngestParams): Promise<IngestResult> {
  const form = new FormData()
  form.append('file', params.file)
  form.append('collection_id', params.collection_id)
  form.append('chunking_strategy', params.chunking_strategy)
  if (params.chunk_size !== undefined) form.append('chunk_size', String(params.chunk_size))
  if (params.chunk_overlap !== undefined) form.append('chunk_overlap', String(params.chunk_overlap))
  return apiPostForm<IngestResult>(API_ROUTES.documents.ingest, form)
}

export interface ChunksResult {
  document_id: string
  total_chunks: number
  chunks: Chunk[]
}

export function listDocumentChunks(documentId: string): Promise<ChunksResult> {
  return apiGet<{
    document_id: string
    total_chunks: number
    chunks: Array<{ chunk_index: number; content: string; chunk_metadata: Record<string, unknown> }>
  }>(API_ROUTES.documents.chunks(documentId)).then((data) => ({
    document_id: data.document_id,
    total_chunks: data.total_chunks,
    chunks: data.chunks.map((c) => ({
      chunk_index: c.chunk_index,
      content: c.content,
      metadata: c.chunk_metadata,
    })),
  }))
}
