/*
 * Commerce: the server cart, checkout options and order placement.
 *
 * The cart lives on the server. The browser holds only an opaque token, and
 * every price and total in here comes back from the API — nothing is computed
 * client-side, because a total the client calculates is a total the client can
 * change.
 */

import { BASE_URL } from './api';

const PREFIX = '/api/v1';
const TOKEN_KEY = 'arova-cart-token';

export class CommerceError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.name = 'CommerceError';
    this.status = status;
    this.code = code;
    this.fields = fields ?? null;
  }

  get fieldErrors() {
    return this.fields ?? {};
  }
}

const request = async (path, { method = 'GET', body } = {}) => {
  let res;
  try {
    res = await fetch(`${BASE_URL}${PREFIX}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new CommerceError(0, 'NETWORK_ERROR', 'Could not reach the server. Check your connection.');
  }

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const e = payload?.error ?? {};
    throw new CommerceError(
      res.status,
      e.code ?? 'UNKNOWN',
      e.message ?? `Request failed (${res.status}).`,
      e.fields,
    );
  }

  return payload;
};

/*
 * Token storage.
 *
 * localStorage throws in private mode and when site data is blocked, so every
 * access is guarded. Without it the cart still works for the current page view —
 * it just will not survive a reload, which is better than the page crashing.
 */
export const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const writeToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Not fatal; see above.
  }
};

export const cartApi = {
  get: (token) => request(`/cart/${token}`),
  addItem: (token, productId, quantity = 1) =>
    request('/cart/items', { method: 'POST', body: { token, productId, quantity } }),
  setQuantity: (token, itemId, quantity) =>
    request(`/cart/${token}/items/${itemId}`, { method: 'PATCH', body: { quantity } }),
  removeItem: (token, itemId) =>
    request(`/cart/${token}/items/${itemId}`, { method: 'DELETE' }),
  clear: (token) => request(`/cart/${token}`, { method: 'DELETE' }),
  applyCoupon: (token, code) =>
    request(`/cart/${token}/coupon`, { method: 'POST', body: { code } }),
  removeCoupon: (token) => request(`/cart/${token}/coupon`, { method: 'DELETE' }),
};

export const checkoutApi = {
  options: (date) =>
    request(`/collection-options${date ? `?date=${encodeURIComponent(date)}` : ''}`),
  centers: () => request('/centers'),
  paymentConfig: () => request('/payments/config'),
  placeOrder: (body) => request('/orders', { method: 'POST', body }),
  verifyPayment: (body) => request('/payments/verify', { method: 'POST', body }),
  getOrder: (orderNumber, token) =>
    request(`/orders/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`),
};

/*
 * Razorpay's checkout script, loaded on demand.
 *
 * Not in index.html: it would cost every visitor a third-party request to load
 * a payment widget that only matters on one page, and it would let Razorpay see
 * every page view on the site.
 */
let scriptPromise = null;

export const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => {
        // Allow a later retry rather than caching the failure forever.
        scriptPromise = null;
        reject(new CommerceError(0, 'SCRIPT_BLOCKED', 'The payment window could not load. Check for an ad blocker, or call us to book.'));
      };
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
};

/**
 * Opens Razorpay checkout and resolves once the payment is verified server-side.
 *
 * Dismissal resolves to `{ dismissed: true }` rather than rejecting: closing the
 * window is a normal thing to do, not an error, and the order is still there to
 * pay for.
 */
export const payWithRazorpay = (checkout) =>
  loadRazorpay().then(
    (Razorpay) =>
      new Promise((resolve, reject) => {
        const rzp = new Razorpay({
          key: checkout.keyId,
          amount: checkout.amount,
          currency: checkout.currency,
          name: checkout.name,
          description: checkout.description,
          order_id: checkout.razorpayOrderId,
          prefill: checkout.prefill,
          theme: { color: '#2b7e83' },
          modal: {
            ondismiss: () => resolve({ dismissed: true }),
          },
          handler: (response) => {
            // The browser's word is not enough; the server checks the signature.
            checkoutApi
              .verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              })
              .then((verified) => resolve({ verified }))
              .catch(reject);
          },
        });

        rzp.on('payment.failed', (e) => {
          reject(
            new CommerceError(
              402,
              'PAYMENT_FAILED',
              e?.error?.description ?? 'The payment did not go through. Please try again.',
            ),
          );
        });

        rzp.open();
      }),
  );

export const formatPaise = (paise) =>
  `₹${Number((paise ?? 0) / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
