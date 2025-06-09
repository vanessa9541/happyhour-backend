const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  category:{type: String, required: true},
  imageUrl: {type: String},
  videoUrl: {type: String}
});

module.exports = mongoose.model('Meal', mealSchema);
