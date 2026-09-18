const SESSION_STORAGE_KEY = 'jain-farms-customer-session'

export function readCustomerSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY))
    if (!session?.token || !session?.customer?.customer_id) return null
    if (session.expiresAt && session.expiresAt <= Date.now()) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function storeCustomerSession(authResponse) {
  const session = {
    token: authResponse.access_token,
    customer: authResponse.customer,
    expiresAt: Date.now() + Number(authResponse.expires_in_seconds) * 1000,
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  return session
}
