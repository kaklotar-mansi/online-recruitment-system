// Small wrapper around fetch so components don't repeat base-URL / JSON logic.
// If your backend runs somewhere other than localhost:5000, change BASE_URL here.

const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Moderation
  getItems: (status = 'all') => request(`/moderation/items?status=${status}`),
  rescanItem: (id, moderator) =>
    request(`/moderation/items/${id}/rescan`, { method: 'POST', body: JSON.stringify(moderator) }),
  decideItem: (id, payload) =>
    request(`/moderation/items/${id}/decision`, { method: 'POST', body: JSON.stringify(payload) }),

  // Audit
  getAuditLogs: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/audit/logs?${params}`);
  },
  getItemHistory: (targetId) => request(`/audit/logs/item/${targetId}`),
  getSummary: () => request('/audit/summary'),
};
