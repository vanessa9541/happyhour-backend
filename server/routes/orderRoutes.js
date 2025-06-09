const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Assure-toi que ce fichier existe et exporte bien ton modèle Mongoose

// 📦 POST /api/orders - Créer une nouvelle commande
router.post('/', async (req, res) => {
  console.log('✅ Contenu de la requête reçue:', req.body);
  try {
    const { customerName, phoneNumber, address, note, meals, totalPrice } = req.body;

    // ✅ Validation simple
    if (!customerName || !phoneNumber || !address || !meals || !Array.isArray(meals) || meals.length === 0 || !totalPrice) {
      return res.status(400).json({ message: 'Champs requis manquants ou invalides' });
    }

    const newOrder = new Order({
      customerName,
      phoneNumber,
      address,
      note: note || '',
      meals,
      totalPrice
      
    });

    const savedOrder = await newOrder.save();

    // 📡 Émission complète vers le socket pour l'interface admin (Notification.js)
    const io = req.app.get('io');
    if (io) {
      const fullOrder = {
        _id: savedOrder._id,
        customerName: savedOrder.customerName,
        phoneNumber: savedOrder.phoneNumber,
        address: savedOrder.address,
        note: savedOrder.note,
        meals: savedOrder.meals,
        totalPrice: savedOrder.totalPrice,
        createdAt: savedOrder.createdAt,
      };
      io.emit('newOrder', fullOrder);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la commande' });
  }
});

// 📥 GET /api/orders - Obtenir toutes les commandes
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des commandes' });
  }
});

// 📤 DELETE /api/orders/:id - Supprimer une commande
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de commande :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
