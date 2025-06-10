import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import Notifications from './Notification.js';
import GestionRepas from './MealManager.js';
import Commandes from './OrdersList.js';
import Promotions from './PromotionManager.js';

export default function AdminHome() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />
      <main style={{ flexGrow: 1, backgroundColor: '#ecf0f1', padding: 30, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Notifications />} />
          <Route path="/gestion-repas" element={<GestionRepas />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/promotions" element={<Promotions />} />
        </Routes>
      </main>
    </div>
  );
}

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#1abc9c' : '#ecf0f1',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none'
  });

  return (
    <nav style={{
      width: 220,
      backgroundColor: '#34495e',
      color: 'white',
      padding: 20,
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: 30 }}>Tableau de bord HappyHour</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: 15 }}>
          <NavLink to="/" end style={linkStyle}>
            Accueil
          </NavLink>
        </li>
        <li style={{ marginBottom: 15 }}>
          <NavLink to="/gestion-repas" style={linkStyle}>
            Gestion des repas
          </NavLink>
        </li>
        <li style={{ marginBottom: 15 }}>
          <NavLink to="/commandes" style={linkStyle}>
            Commandes
          </NavLink>
        </li>
        <li>
          <NavLink to="/promotions" style={linkStyle}>
            Promotions
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
