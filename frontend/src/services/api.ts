const API_BASE_URL = 'http://localhost:5000/api'

interface RequestOptions extends RequestInit {
  token?: string
}

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { token, headers, ...restOptions } = options

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Erro ao se comunicar com o servidor.'
    )
  }

  return response.json() as Promise<T>
}

export default {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, {
      method: 'GET',
      token
    }),

  post: <T, Body>(endpoint: string, body: Body, token?: string) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      token
    }),

  put: <T, Body>(endpoint: string, body: Body, token?: string) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      token
    }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, {
      method: 'DELETE',
      token
    })
}