import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getProductById } from "../data/products";

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
const STORAGE_KEY = "arova-cart";

// localStorage can throw (private mode, blocked site data), so every access is guarded.
function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && getProductById(i.id))
      .map((i) => ({
        id: Number(i.id),
        quantity: Math.max(1, Number(i.quantity) || 1),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  /*
   * Cart additions raise a toast from here rather than from each call site, so
   * every path that adds something — product cards, the product page, the
   * catalogue rows, the cart's own suggestions — confirms itself without
   * having to remember to.
   */
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    clearTimeout(toastTimers.current.get(id));
    toastTimers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Clear every pending timer if the provider ever unmounts.
  useEffect(
    () => () => {
      toastTimers.current.forEach(clearTimeout);
      toastTimers.current.clear();
    },
    [],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable — the cart still works for this page view.
    }
  }, [items]);

  const addItem = useCallback(
    (productId, quantity = 1, { notify = true } = {}) => {
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

      if (!notify) return;

      const id = `${product.id}-${Date.now()}`;
      // Only ever one toast on screen: a stack of them is noise, and the latest
      // addition is the only one anybody is looking for.
      setToasts((prev) => {
        prev.forEach((t) => clearTimeout(toastTimers.current.get(t.id)));
        toastTimers.current.clear();
        return [
          { id, title: product.title, price: product.salePrice * quantity },
        ];
      });

      toastTimers.current.set(
        id,
        setTimeout(() => dismissToast(id), 4000),
      );
    },
    [dismissToast],
  );

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity: qty } : i)),
    );
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
    const total = detailed.reduce(
      (sum, i) => sum + i.product.salePrice * i.quantity,
      0,
    );

    return {
      items: detailed,
      count,
      total,
      addItem,
      removeItem,
      setQuantity,
      clear,
      toasts,
      dismissToast,
    };
  }, [items, addItem, removeItem, setQuantity, clear, toasts, dismissToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
