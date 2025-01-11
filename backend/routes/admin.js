const express = require('express');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  suspendUser,
  deleteUser,
  getRecipes,
  approveRecipe,
  rejectRecipe,
  deleteRecipe,
  getFeaturedRecipes,
  featureRecipe,
  unfeatureRecipe,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword
} = require('../controllers/admin');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

// Recipe management
router.get('/recipes', getRecipes);
router.put('/recipes/:id/approve', approveRecipe);
router.put('/recipes/:id/reject', rejectRecipe);
router.delete('/recipes/:id', deleteRecipe);

// Featured recipes
router.get('/featured-recipes', getFeaturedRecipes);
router.put('/recipes/:id/feature', featureRecipe);
router.put('/recipes/:id/unfeature', unfeatureRecipe);

// Blog management
router.get('/blogs', getBlogs);
router.get('/blogs/:id', getBlog);
router.post('/blogs', upload.single('picture'), createBlog);
router.put('/blogs/:id', upload.single('picture'), updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Admin profile
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.put('/change-password', changeAdminPassword);

module.exports = router;