import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get('https://happyhour-backend.onrender.com/api/orders');
        const tri = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCommandes(tri);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    };

    fetchCommandes();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cette commande ?");
    if (!confirm) return;

    try {
      await axios.delete(`https://happyhour-backend.onrender.com/api/orders/${id}`);
      setCommandes(prev => prev.filter(cmd => cmd._id !== id));
      alert("Commande supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📦 Commandes Archivées</h2>

      {commandes.length === 0 ? (
        <p>Aucune commande enregistrée.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {commandes.map((cmd, index) => (
            <li key={cmd._id || index} style={{
              backgroundColor: '#f9f9f9',
              marginBottom: '15px',
              padding: '15px',
              borderRadius: '10px',
              boxShadow: '0 0 5px rgba(0,0,0,0.1)'
            }}>
              <p><strong>👤 Nom :</strong> {cmd.customerName || 'Client inconnu'}</p>
              <p><strong>📞 Téléphone :</strong> {cmd.phoneNumber || 'Non fourni'}</p>
              <p><strong>🏠 Adresse :</strong> {cmd.address || 'Non fournie'}</p>
              <p><strong>🍽️ Repas :</strong> {Array.isArray(cmd.meals)
                ? cmd.meals.map(item => `${item.name || 'Inconnu'} x${item.quantity || 1}`).join(', ')
                : 'Non défini'}</p>
              <p><strong>💰 Total :</strong> {cmd.totalPrice || 0} FCFA</p>
              <p><strong>📝 Note :</strong> {cmd.note || 'Aucune'}</p>
              <p><strong>🕒 Date :</strong> {new Date(cmd.createdAt).toLocaleString()}</p>

              <button onClick={() => handleDelete(cmd._id)} style={{
                marginTop: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList; 
