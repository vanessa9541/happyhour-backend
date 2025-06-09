const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: String,
  discount: Number,
  description: String,
  validUntil: Date,
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
