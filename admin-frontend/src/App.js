// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import de l'interface administrateur
import AdminHome from './admin/AdminHome';

// Composant wrapper pour enregistrer le service worker
function ServiceWorkerWrapper({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker enregistré avec succès:', registration);
        })
        .catch(error => {
          console.error('Erreur d\'enregistrement du Service Worker:', error);
        });
    } else {
      console.log('Service Worker non supporté par ce navigateur.');
    }
  }, []);

  return children;
}

function App() {
  return (
    <ServiceWorkerWrapper>
      <Router>
        <Routes>
          {/* Route par défaut vers l'administration */}
          <Route path="/*" element={<AdminHome />} />

          {/* Exemples de routes à ajouter plus tard si besoin */}
          {/* 
          <Route path="/client/*" element={<ClientHome />} />
          <Route path="/serveur/*" element={<ServerHome />} /> 
          */}
        </Routes>
      </Router>
    </ServiceWorkerWrapper>
  );
}

export default App;
