const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs
} = require('../controllers/blogs');

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlog);

// Protected routes
router.use(protect);
router.get('/user/blogs', getUserBlogs); // Keep this endpoint consistent
router.post('/', upload.single('picture'), createBlog);
router.put('/:id', upload.single('picture'), updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;