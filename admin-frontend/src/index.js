import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
// Enregistrement du service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) =>
      console.log("Service Worker installé.", registration)
    )
    .catch((error) =>
      console.error("Échec d'installation.", error)
    );
}