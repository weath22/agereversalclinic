import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { TreatmentCartProvider } from './context/TreatmentCartContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <TreatmentCartProvider>
          <App />
        </TreatmentCartProvider>
      </CartProvider>
    </ErrorBoundary>
  </StrictMode>,
);
