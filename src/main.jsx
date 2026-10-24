import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { CommunityProvider } from './context/CommunityContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CommunityProvider>
        <App />
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: 16, background: '#171923', color: '#fff', fontSize: 14 } }} />
      </CommunityProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
