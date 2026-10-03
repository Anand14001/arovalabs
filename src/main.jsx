import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import SmoothScroll from './components/SmoothScroll';
import { CartProvider } from './context/CartContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      SmoothScroll sits above the router so the Lenis instance survives
      navigation — a per-route instance would re-initialise mid-transition and
      drop the scroll position.
    */}
    <SmoothScroll>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </SmoothScroll>
  </StrictMode>,
);
