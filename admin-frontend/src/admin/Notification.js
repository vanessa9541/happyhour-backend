import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../socket'; // Vérifie que ce fichier existe et connecte au bon serveur

const Notification = () => {
  const [commandes, setCommandes] = useState([]);
  const [nouvelleCommande, setNouvelleCommande] = useState(null);

  useEffect(() => {
    // Chargement initial des commandes (commandes des dernières 24h)
    const fetchCommandes = async () => {
      try {
        const response = await axios.get('https://happyhour-backend.onrender.com/api/orders');
        const now = new Date();

        const commandesRecentes = response.data.filter((order) => {
          const dateCommande = new Date(order.createdAt);
          return now - dateCommande <= 24 * 60 * 60 * 1000;
        });

        const tri = commandesRecentes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCommandes(tri);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      }
    };

    fetchCommandes();
  }, []);

  useEffect(() => {
    // Fonction pour jouer le son de notification
    const playNotificationSound = () => {
      try {
        const audio = new Audio('/notif.mp3'); // Ton fichier son doit être dans /public
        audio.play().catch((error) => {
          console.warn("Audio bloqué par navigateur :", error);
        });
      } catch (error) {
        console.error("Erreur lecture son notification :", error);
      }
    };

    // Handler à la réception d'une nouvelle commande
    const handleNewOrder = (order) => {
      console.log('✅ Nouvelle commande reçue :', order);

      setCommandes((prev) => {
        if (prev.find((cmd) => cmd._id === order._id)) {
          return prev; // Déjà dans la liste
        }
        const maintenant = new Date();
        return [order, ...prev].filter((cmd) => {
          const age = maintenant - new Date(cmd.createdAt);
          return age <= 24 * 60 * 60 * 1000;
        });
      });

      setNouvelleCommande(order);
      playNotificationSound();
    };

    socket.on('newOrder', handleNewOrder);

    return () => {
      socket.off('newOrder', handleNewOrder);
    };
  }, []);

  const afficherDetails = (commande) => {
    if (!commande) return;

    const nom = commande.customerName || 'Non fourni';
    const phone = commande.phoneNumber || 'Non fourni';
    const adresse = commande.address || 'Non fournie';
    const note = commande.note || 'Aucune';
    const total = commande.totalPrice || 0;
    const date = commande.createdAt ? new Date(commande.createdAt).toLocaleString() : 'Date inconnue';
    const repas = Array.isArray(commande.meals)
      ? commande.meals.map((item) => `${item.name || 'Inconnu'} x${item.quantity || 1}`).join(', ')
      : 'Non défini';

    alert(`
🧑 Nom : ${nom}
📞 Téléphone : ${phone}
🏠 Adresse : ${adresse}
🍽️ Repas : ${repas}
💰 Total : ${total} FCFA
📝 Note : ${note}
🕒 Date : ${date}
    `);

    setNouvelleCommande(null);
  };

  return (
    <div className="notifications-container">
      <h2>Notifications de Commandes</h2>

      {nouvelleCommande && (
        <div style={{ background: 'yellow', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
          ✅ Nouvelle commande de {nouvelleCommande.customerName || 'Client inconnu'} reçue !
        </div>
      )}

      {commandes.length === 0 ? (
        <p>Aucune commande récente.</p>
      ) : (
        <ul className="liste-commandes">
          {commandes.map((cmd, index) => (
            <li
              key={cmd._id || index}
              className="commande-item"
              onClick={() => afficherDetails(cmd)}
              style={{ backgroundColor: '#f8f8f8', margin: '8px 0', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <strong>{cmd.customerName || 'Client inconnu'}</strong> - {cmd.totalPrice || 0} FCFA
              <div className="date" style={{ fontSize: '0.8em', color: '#666' }}>
                {cmd.createdAt ? new Date(cmd.createdAt).toLocaleString() : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
