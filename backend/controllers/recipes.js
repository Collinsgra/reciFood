const Recipe = require('../models/Recipe');
const path = require('path');
const User = require('../models/User');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'name');
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name');
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, timeInMinutes, servings, calories, category } = req.body;
    
    console.log('Received recipe data:', req.body);

    const recipe = new Recipe({
      title,
      description,
      ingredients: JSON.parse(ingredients),
      instructions: JSON.parse(instructions),
      timeInMinutes,
      servings,
      calories,
      category,
      createdBy: req.user._id,
      creatorName: req.user.name,
      picture: req.file ? path.join('/uploads', req.file.filename) : null,
    });

    const createdRecipe = await recipe.save();
    console.log('Created recipe:', createdRecipe);

    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, timeInMinutes, servings, calories, category } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      if (recipe.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to update this recipe' });
      }

      recipe.title = title || recipe.title;
      recipe.description = description || recipe.description;
      recipe.ingredients = ingredients ? JSON.parse(ingredients) : recipe.ingredients;
      recipe.instructions = instructions ? JSON.parse(instructions) : recipe.instructions;
      recipe.timeInMinutes = timeInMinutes || recipe.timeInMinutes;
      recipe.servings = servings || recipe.servings;
      recipe.calories = calories || recipe.calories;
      recipe.category = category || recipe.category;
      recipe.creatorName = req.user.name;
      if (req.file) {
        recipe.picture = path.join('/uploads', req.file.filename);
      }

      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is either the owner of the recipe or an admin
    if (recipe.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or already deleted' });
    }

    res.json({ message: 'Recipe removed successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error while deleting recipe', error: error.message });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCreatorRecipes = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const creator = await User.findById(creatorId).select('name');
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }
    const recipes = await Recipe.find({ createdBy: creatorId });
    res.json({ creator, recipes });
  } catch (error) {
    console.error('Error fetching creator recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};