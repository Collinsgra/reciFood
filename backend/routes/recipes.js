const express = require('express');
const { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, getUserRecipes, getCreatorRecipes } = require('../controllers/recipes');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/user', protect, getUserRecipes);
router.get('/:id', getRecipe);
router.get('/creator/:creatorId', getCreatorRecipes);
router.post('/', protect, upload.single('picture'), createRecipe);
router.put('/:id', protect, upload.single('picture'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;