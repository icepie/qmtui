/** @typedef {Record<string, unknown> & { error?: string; message?: string }} ApiResponse */

/**
 * Fetch + parse a JSON endpoint, throwing on non-2xx responses.
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<ApiResponse>}
 */
export async function api(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  /** @type {ApiResponse} */
  let value = {};
  try {
    value = text ? JSON.parse(text) : {};
  } catch {
    value = { error: text || `HTTP ${response.status}` };
  }
  if (!response.ok) throw new Error(value.error || value.message || `HTTP ${response.status}`);
  return value;
}

/**
 * POST a JSON body to an endpoint.
 * @param {string} url
 * @param {unknown} [body]
 * @returns {Promise<ApiResponse>}
 */
export function post(url, body) {
  return api(url, {
    method: 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
