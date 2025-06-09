const Promotion = require('../models/Promotion');

const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération promotions', error });
  }
};

const createPromotion = async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création promotion', error });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: 'Erreur modification promotion', error });
  }
};

const deletePromotion = async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression promotion', error });
  }
};

module.exports = { getPromotions, createPromotion, updatePromotion, deletePromotion };
