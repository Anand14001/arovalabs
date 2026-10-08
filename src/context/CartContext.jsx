import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi, readToken, writeToken } from '../lib/commerce';

/*
 * Cart.
 *
 * Server-owned. The browser holds an opaque token and nothing else; quantities
 * go up to the API and every price and total comes back from it. A cart whose
 * prices live in localStorage is a cart that shows yesterday's prices and can be
 * edited with devtools — neither is acceptable for something that ends in a
 * payment.
 *
 * The shape exposed here is deliberately the same as the old client-side cart's
 * — `items[].product` carrying rupee prices — so the cart page, line items and
 * summary did not have to be rewritten around a new contract. The translation
 * from the API's paise happens once, below.
 */

const CartContext = createContext(null);

const CART_KEY = ['cart'];

/** API cart line → the shape the existing cart components render. */
const toItem = (line) => ({
  // `id` stays the product id because that is what call sites pass to addItem
  // and what the cart page keys on; the cart-line id is carried separately.
  id: line.productId,
  itemId: line.id,
  quantity: line.quantity,
  product: {
    id: line.productId,
    slug: line.slug,
    title: line.title,
    type: line.type === 'PACKAGE' ? 'package' : 'test',
    salePrice: line.unitPriceRupees,
    regularPrice: line.regularPrice / 100,
    discount: line.discountLabel,
    archiveImage: line.image,
    cardImage: line.image,
  },
  priceChanged: line.priceChanged,
  unavailable: line.unavailable,
});

export function CartProvider({ children }) {
  const qc = useQueryClient();
  const [token, setToken] = useState(readToken);

  const query = useQuery({
    queryKey: CART_KEY,
    queryFn: () => cartApi.get(token),
    enabled: Boolean(token),
    retry: false,
    staleTime: 10_000,
  });

  /*
   * A token that no longer resolves — expired, or already turned into an order —
   * is discarded so the next add starts a fresh cart instead of failing forever.
   */
  useEffect(() => {
    if (query.error && [404, 409].includes(query.error.status)) {
      writeToken(null);
      setToken(null);
      qc.removeQueries({ queryKey: CART_KEY });
    }
  }, [query.error, qc]);

  const cart = query.data?.cart ?? null;

  const applyResult = useCallback(
    (data) => {
      const next = data.cart;
      if (next.token !== token) {
        writeToken(next.token);
        setToken(next.token);
      }
      qc.setQueryData(CART_KEY, data);
      return next;
    },
    [qc, token],
  );

  /*
   * Toasts are raised here rather than at each call site, so every path that
   * adds something — product cards, the detail page, the catalogue rows, the
   * cart's own suggestions — confirms itself without having to remember to.
   */
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    clearTimeout(toastTimers.current.get(id));
    toastTimers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(
    () => () => {
      toastTimers.current.forEach(clearTimeout);
      toastTimers.current.clear();
    },
    [],
  );

  const raiseToast = useCallback(
    (title, price) => {
      const id = `${title}-${Date.now()}`;
      // Only ever one toast on screen: a stack of them is noise, and the latest
      // addition is the only one anybody is looking for.
      setToasts((prev) => {
        prev.forEach((t) => clearTimeout(toastTimers.current.get(t.id)));
        toastTimers.current.clear();
        return [{ id, title, price }];
      });
      toastTimers.current.set(id, setTimeout(() => dismissToast(id), 4000));
    },
    [dismissToast],
  );

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.addItem(token, productId, quantity),
  });

  const addItem = useCallback(
    async (productId, quantity = 1, { notify = true } = {}) => {
      const data = await addMutation.mutateAsync({ productId, quantity });
      const next = applyResult(data);
      if (notify) {
        const line = next.items.find((i) => i.productId === productId);
        if (line) raiseToast(line.title, line.unitPriceRupees * quantity);
      }
      return next;
    },
    [addMutation, applyResult, raiseToast],
  );

  const setQuantity = useCallback(
    async (productId, quantity) => {
      const line = cart?.items.find((i) => i.productId === productId);
      if (!line) return;
      applyResult(await cartApi.setQuantity(token, line.id, Math.max(0, Number(quantity) || 0)));
    },
    [cart, token, applyResult],
  );

  const removeItem = useCallback(
    async (productId) => {
      const line = cart?.items.find((i) => i.productId === productId);
      if (!line) return;
      applyResult(await cartApi.removeItem(token, line.id));
    },
    [cart, token, applyResult],
  );

  const clear = useCallback(async () => {
    if (!token) return;
    applyResult(await cartApi.clear(token));
  }, [token, applyResult]);

  const applyCoupon = useCallback(
    async (code) => applyResult(await cartApi.applyCoupon(token, code)),
    [token, applyResult],
  );

  const removeCoupon = useCallback(
    async () => applyResult(await cartApi.removeCoupon(token)),
    [token, applyResult],
  );

  /** Called after checkout converts the cart, so the UI empties immediately. */
  const reset = useCallback(() => {
    writeToken(null);
    setToken(null);
    qc.removeQueries({ queryKey: CART_KEY });
  }, [qc]);

  const value = useMemo(() => {
    const items = (cart?.items ?? []).map(toItem);

    return {
      items,
      count: cart?.count ?? 0,
      // Rupees, matching what the cart components have always rendered.
      total: (cart?.totals?.total ?? 0) / 100,
      // The server's full breakdown, for checkout.
      totals: cart?.totals ?? null,
      coupon: cart?.coupon ?? null,
      couponProblem: cart?.couponProblem ?? null,
      token,
      isLoading: Boolean(token) && query.isLoading,
      isSyncing: addMutation.isPending,

      addItem,
      removeItem,
      setQuantity,
      clear,
      applyCoupon,
      removeCoupon,
      reset,

      toasts,
      dismissToast,
    };
  }, [
    cart,
    token,
    query.isLoading,
    addMutation.isPending,
    addItem,
    removeItem,
    setQuantity,
    clear,
    applyCoupon,
    removeCoupon,
    reset,
    toasts,
    dismissToast,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
