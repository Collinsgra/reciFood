const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  timeInMinutes: {
    type: Number,
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Soup', 'Main Course', 'Dessert', 'Appetizer', 'Salad', 'Breakfast', 'Snack']
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  picture: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;