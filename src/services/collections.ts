import { apiDelete, apiGet, apiPost } from './http'
import { API_ROUTES } from '@/lib/api-routes'
import type { Collection } from '@/lib/types'

// ⚠️ PONTO DE ATENÇÃO (BACKEND): CollectionResponse não retorna document_count.
// O campo é exibido nas coleções do front mas não está disponível na API.
// Sugestão: adicionar document_count ao CollectionResponse no backend.
interface ApiCollectionResponse {
  id: string
  name: string
  description: string | null
  created_at: string
}

function toCollection(api: ApiCollectionResponse): Collection {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? '',
    created_at: api.created_at.slice(0, 10),
    document_count: 0, // ⚠️ não retornado pelo backend
  }
}

export function listCollections(): Promise<Collection[]> {
  return apiGet<ApiCollectionResponse[]>(API_ROUTES.collections.list).then((data) =>
    data.map(toCollection),
  )
}

export function createCollection(name: string, description?: string): Promise<Collection> {
  return apiPost<ApiCollectionResponse>(API_ROUTES.collections.create, {
    name,
    description: description || null,
  }).then(toCollection)
}

export function deleteCollection(id: string): Promise<void> {
  return apiDelete(API_ROUTES.collections.delete(id))
}
