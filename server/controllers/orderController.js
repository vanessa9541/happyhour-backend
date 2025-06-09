const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    console.log("Données recues dans la commande :", req.body);
    // ✅ Correction : extraction des bons champs
    const {
      customerName,
      phoneNumber,
      address,
      note,
      meals,
      totalPrice
    } = req.body;
    if(! customerName || !phoneNumber|| !address || !meals || !totalPrice ){
      return res.status(400).json({message: "Champs manquants obligatoire."});
    }
    // ✅ Création de la commande avec les bons noms
    const newOrder = new Order({
      customerName,
      phoneNumber,
      address,
      note,
      meals,
      totalPrice,
      createdAt: new Date()
    });

    await newOrder.save();

    // Envoi via Socket.io
    if (req.io) {
      req.io.emit('newOrder', newOrder);
    }
    console.log ("Commande enregistrée :", newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la commande' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};
