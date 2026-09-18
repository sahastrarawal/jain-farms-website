const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = 15_000

class ApiError extends Error {
  constructor(message, status = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function isApiConfigured() {
  return Boolean(configuredBaseUrl)
}

function apiBaseUrl() {
  if (!configuredBaseUrl) {
    throw new ApiError('VITE_API_BASE_URL is not configured for the website.')
  }

  if (import.meta.env.PROD && !configuredBaseUrl.startsWith('https://')) {
    throw new ApiError('Production website builds require an HTTPS API URL.')
  }

  return configuredBaseUrl
}

function errorMessage(body, fallback) {
  if (typeof body?.detail === 'string') return body.detail
  if (Array.isArray(body?.detail)) {
    const messages = body.detail.flatMap((item) => (item?.msg ? [item.msg] : []))
    if (messages.length) return messages.join(' ')
  }
  return fallback
}

async function request(path, options = {}) {
  const { token, ...requestOptions } = options
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${apiBaseUrl()}${path}`, {
      ...requestOptions,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(requestOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...requestOptions.headers,
      },
    })
    const body = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        errorMessage(body, `Request failed with status ${response.status}.`),
        response.status,
      )
    }

    return body
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please check your connection and try again.')
    }
    throw new ApiError('Unable to connect to Jain Farms. Please check your internet connection.')
  } finally {
    window.clearTimeout(timeout)
  }
}

export const customerApi = {
  categories: () => request('/customer/categories'),
  banners: () => request('/customer/banners'),
  products: (categoryId) =>
    request(
      `/customer/products${categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : ''}`,
    ),
  exchangeFirebaseToken: (idToken) =>
    request('/customer/auth/firebase', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    }),
  cart: (token) => request('/customer/cart', { token }),
  setCartItem: (token, item) =>
    request('/customer/cart/items', {
      method: 'PUT',
      token,
      body: JSON.stringify(item),
    }),
  removeCartItem: (token, productId, variantId) =>
    request(
      `/customer/cart/items/${encodeURIComponent(productId)}${
        variantId ? `?variant_id=${encodeURIComponent(variantId)}` : ''
      }`,
      { method: 'DELETE', token },
    ),
}
