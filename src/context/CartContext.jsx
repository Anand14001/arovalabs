import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products';

/*
 * Client-side cart only.
 *
 * The reference site runs WooCommerce: `?add-to-cart=<id>` posts to the server,
 * which persists the cart in a PHP session and drives checkout + payment. None of
 * that backend is reachable from this recreation, so the cart is kept in React
 * state and mirrored into localStorage — that keeps it alive across navigations
 * and reloads, the way the server session does on the reference site.
 *
 * Nothing here places an order or takes a payment, and /checkout/ says so
 * explicitly rather than implying a booking succeeded.
 */

const CartContext = createContext(null);
const STORAGE_KEY = 'arova-cart';

// localStorage can throw (private mode, blocked site data), so every access is guarded.
function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && getProductById(i.id))
      .map((i) => ({ id: Number(i.id), quantity: Math.max(1, Number(i.quantity) || 1) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable — the cart still works for this page view.
    }
  }, [items]);

  const addItem = useCallback((productId, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { id: product.id, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity: qty } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const detailed = items
      .map((i) => {
        const product = getProductById(i.id);
        return product ? { ...i, product } : null;
      })
      .filter(Boolean);

    const count = detailed.reduce((sum, i) => sum + i.quantity, 0);
    const total = detailed.reduce((sum, i) => sum + i.product.salePrice * i.quantity, 0);

    return { items: detailed, count, total, addItem, removeItem, setQuantity, clear };
  }, [items, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
