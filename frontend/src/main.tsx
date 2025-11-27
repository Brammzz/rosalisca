import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import App from './App.tsx';
import './index.css';

// Loading component
const Loading = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p className="mt-4 text-gray-600">Memuat aplikasi...</p>
  </div>
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  );
}

// Register service worker untuk caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('SW registered'))
    .catch(() => console.log('SW registration failed'));
}
