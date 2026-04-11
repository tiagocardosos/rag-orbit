/**
 * Centraliza todos os paths da API do backend.
 * Nunca utilize URLs completas fora deste arquivo — use sempre as constantes abaixo.
 * O domínio/base é configurado via VITE_API_BASE_URL no .env.
 */
export const API_ROUTES = {
  collections: {
    list: '/collections',
    create: '/collections',
    get: (id: string) => `/collections/${id}`,
    delete: (id: string) => `/collections/${id}`,
    documents: (id: string) => `/collections/${id}/documents`,
  },
  documents: {
    ingest: '/documents/ingest',
    chunks: (documentId: string) => `/documents/${documentId}/chunks`,
  },
  chunking: {
    preview: '/chunking/preview',
  },
  dashboard: '/dashboard',
  search: '/search',
  rag: {
    chat: '/rag/chat',
  },
  experiments: {
    run: '/experiments/run',
    list: '/experiments',
    get: (id: string) => `/experiments/${id}`,
  },
} as const
