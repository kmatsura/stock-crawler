export function authHeaders() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return t ? { Authorization: `Bearer ${t}` } : {}
}
