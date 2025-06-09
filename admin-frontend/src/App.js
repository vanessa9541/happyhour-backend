// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import de l'interface administrateur
import AdminHome from './admin/AdminHome';

// Tu peux ajouter d'autres interfaces plus tard (client, serveur, etc.)
// import ClientHome from './Client/ClientHome';
// import ServerHome from './Server/ServerHome';

function App() {
  return (
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
  );
}

export default App;



