import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MealManager() {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    price: '',
    category: 'Menu du jour',
    image: null,
    video: null,
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get('https://happyhour-backend.onrender.com/api/meals');
      setMeals(response.data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des repas', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' || name === 'video') {
      setNewMeal({ ...newMeal, [name]: files[0] });
    } else {
      setNewMeal({ ...newMeal, [name]: value });
    }
  };

  const handleAddMeal = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newMeal.name);
      formData.append('price', newMeal.price);
      formData.append('category', newMeal.category);
      if (newMeal.image) formData.append('image', newMeal.image);
      if (newMeal.video) formData.append('video', newMeal.video);

      const response = await axios.post('https://happyhour-backend.onrender.com/api/meals', formData);
      console.log('✅ Repas ajouté avec succès :', response.data);

      fetchMeals();
      setNewMeal({ name: '', price: '', category: 'Menu du jour', image: null, video: null });

      alert('Repas ajouté avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l’ajout du repas', error);
      alert("Erreur lors de l'ajout du repas");
    }
  };

  const handleDelete = async (mealId) => {
    try {
      const response = await axios.delete(`https://happyhour-backend.onrender.com/api/meals/${mealId}`);
      if (response.status === 200) {
        alert('Repas supprimé avec succès');
        setMeals(prevMeals => prevMeals.filter(meal => meal._id !== mealId));
      } else {
        alert('Suppression non confirmée par le serveur.');
      }
    } catch (error) {
      console.error('❌ Erreur suppression repas :', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <h2>Gestion des repas</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Nom du repas"
          value={newMeal.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Prix"
          value={newMeal.price}
          onChange={handleChange}
        />
        <select name="category" value={newMeal.category} onChange={handleChange}>
          <option value="Menu du jour">Menu du jour</option>
          <option value="Viande">Viande</option>
          <option value="Poisson">Poisson</option>
          <option value="Supplement Complement">Supplement Complement</option>
          <option value="Dessert">Dessert</option>
          <option value="Boisson">Boisson</option>
        </select>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <input type="file" name="video" accept="video/*" onChange={handleChange} />
        <button onClick={handleAddMeal}>Ajouter</button>
      </div>

      <ul style={{ display: 'flex', flexWrap:'wrap', gap: '20px'}}>
        {meals.map((meal) => (
          <li key={meal._id} style={{ marginBottom: 15 }}>
            <strong>{meal.name}</strong> - {meal.price} FCFA - {meal.category}
            {meal.imageUrl && (
              <div>
                <img src={meal.imageUrl} alt={meal.name} width="100" />
              </div>
            )}
            {meal.videoUrl && (
              <div>
                <video width="160" controls>
                  <source src={meal.videoUrl} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            )}
            <button onClick={() => handleDelete(meal._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MealManager;

 