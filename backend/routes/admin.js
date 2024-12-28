const express = require('express');
const { body, param } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const adminController = require('../controllers/admin');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Apply protect and admin middleware to all routes
router.use(protect, admin);

// Apply rate limiting to all admin routes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(adminLimiter);

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/recent-activity', adminController.getRecentActivity);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role',
  [
    param('id').isMongoId(),
    body('role').isIn(['user', 'admin', 'moderator'])
  ],
  adminController.updateUserRole
);

router.get('/recipes', adminController.getRecipes);
router.put('/recipes/:id/status',
  [
    param('id').isMongoId(),
    body('status').isIn(['draft', 'published', 'archived'])
  ],
  adminController.updateRecipeStatus
);

router.get('/featured-recipes', adminController.getFeaturedRecipes);
router.get('/blog-posts', adminController.getBlogPosts);
router.get('/analytics', adminController.getAnalytics);
router.get('/comments', adminController.getComments);
router.put('/comments/:id/status',
  [
    param('id').isMongoId(),
    body('status').isIn(['approved', 'rejected', 'pending'])
  ],
  adminController.updateCommentStatus
);

router.post('/notifications',
  [
    body('title').notEmpty().trim(),
    body('content').notEmpty().trim(),
    body('recipients').isArray().notEmpty()
  ],
  adminController.sendNotification
);

router.get('/app-settings', adminController.getAppSettings);
router.put('/app-settings',
  [
    body('appName').optional().trim(),
    body('logo').optional().isURL(),
    body('allowUserRegistration').optional().isBoolean(),
    body('enableComments').optional().isBoolean(),
    body('enableRatings').optional().isBoolean(),
    body('maintenanceMode').optional().isBoolean(),
    body('theme').optional().isIn(['light', 'dark'])
  ],
  adminController.updateAppSettings
);

router.get('/profile', adminController.getAdminProfile);
router.put('/profile',
  [
    body('name').optional().trim(),
    body('email').optional().isEmail().normalizeEmail()
  ],
  adminController.updateAdminProfile
);

router.put('/change-password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  adminController.changeAdminPassword
);

module.exports = router;