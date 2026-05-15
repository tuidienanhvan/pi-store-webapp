import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { LocaleProvider } from './_shared/context/LocaleContext';
import { AuthProvider } from './_shared/context/AuthContext';
import './styles/index.css';

const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <LocaleProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </LocaleProvider>
    </HelmetProvider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}

// Re-enable transitions after the app has mounted + one frame
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-transitions');
  });
});
