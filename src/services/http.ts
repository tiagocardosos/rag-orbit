const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body.detail ?? body.message ?? message
    } catch {
      message = await res.text().catch(() => message)
    }
    throw new ApiError(res.status, message)
  }
  return res.json() as Promise<T>
}

export function apiGet<T>(path: string): Promise<T> {
  return fetch(`${BASE_URL}${path}`).then(handleResponse<T>)
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse<T>)
}

export function apiPostForm<T>(path: string, form: FormData): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: form,
  }).then(handleResponse<T>)
}

export function apiDelete(path: string): Promise<void> {
  return fetch(`${BASE_URL}${path}`, { method: 'DELETE' }).then((res) =>
    handleResponse<void>(res),
  )
}
