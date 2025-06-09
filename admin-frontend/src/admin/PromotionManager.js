import React, { useEffect, useState } from 'react';

export default function PromotionManager() {
  const [promotions, setPromotions] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/promotions');
      const data = await res.json();
      setPromotions(data);
    } catch (err) {
      console.error('Erreur chargement promotions', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:5000/api/promotions/${editingId}`
        : 'http://localhost:5000/api/promotions';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setFormData({ code: '', discount: '', description: '' });
      setEditingId(null);
      fetchPromotions();
    } catch (err) {
      console.error('Erreur ajout/modification promotion', err);
    }
  };

  const handleEdit = (promo) => {
    setFormData({
      code: promo.code,
      discount: promo.discount,
      description: promo.description
    });
    setEditingId(promo._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette promotion ?')) return;
    try {
      await fetch(`http://localhost:5000/api/promotions/${id}`, {
        method: 'DELETE'
      });
      fetchPromotions();
    } catch (err) {
      console.error('Erreur suppression promotion', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎁 Gestion des promotions</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          name="code"
          placeholder="Code promo"
          value={formData.code}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          name="discount"
          placeholder="Réduction (%)"
          value={formData.discount}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        /><br />
        <button type="submit">
          {editingId ? 'Modifier' : 'Ajouter'} la promotion
        </button>
      </form>

      <h3>📋 Promotions existantes</h3>
      <ul>
        {promotions.map(promo => (
          <li key={promo._id} style={{ marginBottom: 15 }}>
            <strong>{promo.code}</strong> - {promo.discount}% <br />
            {promo.description && <em>{promo.description}</em>}<br />
            <button onClick={() => handleEdit(promo)}>Modifier</button>
            <button onClick={() => handleDelete(promo._id)} style={{ marginLeft: 10 }}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
