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
  constructor(status, code, message, fields) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields ?? null;
  }

  get fieldErrors() {
    return this.fields ?? {};
  }
}

const request = async (path, { method = 'GET', body, headers, signal } = {}) => {
  let res;
  try {
    const isJsonBody = body && typeof body === 'object' && !(body instanceof FormData);
    res = await fetch(`${BASE_URL}${PREFIX}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: isJsonBody ? JSON.stringify(body) : body,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // Distinguishing "unreachable" from "rejected" matters: the first is
    // usually the API being down or an origin missing from the CORS allowlist.
    throw new ApiError(0, 'NETWORK_ERROR', 'Could not reach the server.');
  }

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      payload?.error?.code ?? 'UNKNOWN',
      payload?.error?.message ?? `Request failed (${res.status}).`,
      payload?.error?.fields,
    );
  }

  return payload;
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
  submitContact: (data) =>
    request('/contact', {
      method: 'POST',
      body: data,
    }),
};

export { BASE_URL };
