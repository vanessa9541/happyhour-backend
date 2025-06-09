const Meal = require('../models/Meal');

const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();

    const host = req.headers.host || 'localhost:7000'; // dynamique selon requête
    const protocol = req.protocol || 'http';

    // Construire les URLs complètes des fichiers
    const fullMeals = meals.map(meal => ({
      _id: meal._id,
      name: meal.name,
      price: meal.price,
      category: meal.category,
      imageUrl: meal.imageUrl ? `${protocol}://${host}/${meal.imageUrl}` : null,
      videoUrl: meal.videoUrl ? `${protocol}://${host}/${meal.videoUrl}` : null,
    }));

    res.json(fullMeals);
  } catch (error) {
    console.error("Erreur récupération repas :", error);
    res.status(500).json({ message: 'Erreur récupération repas', error });
  }
};

module.exports = { getAllMeals };