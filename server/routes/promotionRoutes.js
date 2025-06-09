const express = require('express');
const router = express.Router();
const { getPromotions, createPromotion, updatePromotion, deletePromotion } = require('../controllers/promotionController');

router.get('/', getPromotions);
//router.post('/', createPromotion);
// POST /api/meals - Ajouter un repas
router.post('/', async (req, res) => {
  try {
    const newMeal = new Meal(req.body);
    const savedMeal = await newMeal.save();

    const io = req.app.get('io');
    if (io) io.emit('mealAdded', savedMeal); // 🟢 EMIT

    res.status(201).json(savedMeal);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', updatePromotion);
//router.delete('/:id', deletePromotion);
router.delete('/:id', async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) io.emit('mealDeleted', deletedMeal); // 🔴 EMIT

    res.status(200).json({ message: 'Repas supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
