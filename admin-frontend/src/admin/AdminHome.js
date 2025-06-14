import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import Notifications from './Notification.js';
import GestionRepas from './MealManager.js';
import Commandes from './OrdersList.js';
import Promotions from './PromotionManager.js';

export default function AdminHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Demande l'autorisation des notifications
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("✅ Les notifications sont activées.");
        } else {
          console.log("❌ Les notifications sont refusées.");
        }
      });
    }
  }, []);

  return (
    <div style={{ display: 'flex', height:'100vh', fontFamily: "'Poppins', sans-serif" }}>
      {/* Bouton burger-menu visible sur mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={styles.burgerBtn}
      >
        ☰
      </button>

      {/* Menu */}
      <Sidebar isMenuOpen={isMenuOpen} />

      {/* Contenu principal */}
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

function Sidebar({ isMenuOpen }) {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#1abc9c' : '#ecf0f1',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none'
  });

  return (
    <nav style={{ 
      ...styles.sidebar, 
      transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
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

const styles = {
  burgerBtn: {
    position: 'fixed',
    top: 20,
    left: 20,
    zIndex: 1000,
    background: '#fff',
    border: 'none',
    fontSize: 30,
    padding: 10,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgb(0 0 0 / 0.5)'
  },
  sidebar: {
    width: 220,
    backgroundColor: '#34495e',
    color: 'white',
    padding: 20,
    boxShadow: '2px 0 5px rgb(0 0 0 / 0.1)', 
    transition: 'transform 0.3s ease-in-out',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 999,
  },
};

