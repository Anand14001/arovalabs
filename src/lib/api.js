/*
 * Public API client.
 *
 * No authentication: everything the website reads is public. The admin's client
 * is a separate file with token handling, because mixing the two would mean
 * shipping refresh logic to every visitor for no reason.
 */

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4100').replace(/\/$/, '');
const PREFIX = '/api/v1';

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const request = async (path, { signal } = {}) => {
  let res;
  try {
    res = await fetch(`${BASE_URL}${PREFIX}${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // Distinguishing "unreachable" from "rejected" matters: the first is
    // usually the API being down or an origin missing from the CORS allowlist.
    throw new ApiError(0, 'NETWORK_ERROR', 'Could not reach the server.');
  }

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? 'UNKNOWN',
      body?.error?.message ?? `Request failed (${res.status}).`,
    );
  }

  return body;
};

const qs = (params) => {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== null && v !== '') search.set(k, v);
  }
  const s = search.toString();
  return s ? `?${s}` : '';
};

export const api = {
  products: (params) => request(`/products${qs(params)}`),
  product: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  related: (slug) => request(`/products/${encodeURIComponent(slug)}/related`),
  categories: () => request('/categories'),
  tags: () => request('/tags'),
};

export { BASE_URL };
