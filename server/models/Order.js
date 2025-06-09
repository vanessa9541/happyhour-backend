const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String },

  meals: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String // chemin d'image ou URI (si jamais utilisé)
    }
  ],

  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
