import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../socket';

const Notification = () => {
  const [commandes, setCommandes] = useState([]);
  const [nouvelleCommande, setNouvelleCommande] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/orders');
        const now = new Date();

        const commandesRécentes = response.data.filter(order => {
          const dateCommande = new Date(order.createdAt);
          return (now - dateCommande) <= 24 * 60 * 60 * 1000; // Moins de 24h
        });

        const tri = commandesRécentes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCommandes(tri);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      }
    };

    fetchCommandes();
  }, []);

  useEffect(() => {
    const handleNewOrder = (order) => {
      console.log('✅ Nouvelle commande reçue :', order);

      if (!commandes.find((cmd) => cmd._id === order._id)) {
        setNouvelleCommande(order);

        setCommandes(prev => {
          const maintenant = new Date();
          const listeFiltrée = [order, ...prev].filter(cmd => {
            const age = maintenant - new Date(cmd.createdAt);
            return age <= 24 * 60 * 60 * 1000;
          });
          return listeFiltrée;
        });

        const audio = new Audio('/notif.mp3');
        audio.play();
      }
    };

    socket.on('newOrder', handleNewOrder);

    return () => {
      socket.off('newOrder', handleNewOrder);
    };
  }, [commandes]);

  const afficherDetails = (commande) => {
    if (!commande) return;

    const nom = commande.customerName || 'Non fourni';
    const phone = commande.phoneNumber || 'Non fourni';
    const adresse = commande.address || 'Non fournie';
    const note = commande.note || 'Aucune';
    const total = commande.totalPrice || 0;
    const date = commande.createdAt
      ? new Date(commande.createdAt).toLocaleString()
      : 'Date inconnue';

    const repas = Array.isArray(commande.meals)
      ? commande.meals.map(item =>
          `${item.name || 'Inconnu'} x${item.quantity || 1}`
        ).join(', ')
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

    // Optionnel : masquer la notification après affichage
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
              style={{
                backgroundColor: '#f8f8f8',
                margin: '8px 0',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
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
