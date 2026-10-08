import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import SmoothScroll from './components/SmoothScroll';
import { CartProvider } from './context/CartContext';
import './index.css';

/*
 * The catalogue is read-only here and changes only when an admin edits it, so
 * it is cached generously: no refetch on focus, and a five-minute freshness
 * window set per query in lib/catalog.js. A visitor browsing tests should not
 * be re-fetching the same ten products on every tab switch.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, error) => {
        // A 404 is an answer. Retrying it only delays the empty state.
        if (error?.status >= 400 && error?.status < 500) return false;
        return count < 2;
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      SmoothScroll sits above the router so the Lenis instance survives
      navigation — a per-route instance would re-initialise mid-transition and
      drop the scroll position.
    */}
    <SmoothScroll>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* The cart resolves its products through the catalogue query, so it
              has to sit inside the provider. */}
          <CartProvider>
            <App />
          </CartProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </SmoothScroll>
  </StrictMode>,
);
