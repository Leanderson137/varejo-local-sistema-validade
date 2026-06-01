const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AUTH_TOKEN_KEY = 'varejo-local-token'

interface RequestOptions extends RequestInit {
  token?: string | null
}

interface ApiErrorResponse {
  message?: string
  error?: string
}

const getStoredToken = (): string | null => {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  )
}

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { token, headers, ...restOptions } = options

  const authToken = token ?? getStoredToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers
    }
  })

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null) as ApiErrorResponse | null

    throw new Error(
      errorData?.message ||
      errorData?.error ||
      'Erro ao se comunicar com o servidor.'
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export default {
  get: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, {
      method: 'GET',
      token
    }),

  post: <T, Body>(endpoint: string, body: Body, token?: string | null) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      token
    }),

  put: <T, Body>(endpoint: string, body: Body, token?: string | null) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      token
    }),

  patch: <T, Body>(endpoint: string, body: Body, token?: string | null) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      token
    }),

  delete: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, {
      method: 'DELETE',
      token
    })
}