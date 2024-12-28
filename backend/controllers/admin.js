const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const AppSettings = require('../models/AppSettings');
const { validationResult } = require('express-validator');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const mostViewedRecipes = await Recipe.find().sort('-views').limit(5).select('title views');

    res.json({ totalRecipes, activeUsers, mostViewedRecipes });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recentRecipes = await Recipe.find().sort('-createdAt').limit(5).select('title createdAt');
    const recentComments = await Comment.find().sort('-createdAt').limit(5).select('content createdAt').populate('user', 'name');
    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email createdAt');

    const recentActivity = [
      ...recentRecipes.map(r => ({ type: 'recipe', ...r.toObject() })),
      ...recentComments.map(c => ({ type: 'comment', ...c.toObject() })),
      ...recentUsers.map(u => ({ type: 'user', ...u.toObject() }))
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

    res.json(recentActivity);
  } catch (error) {
    console.error('Error in getRecentActivity:', error);
    res.status(500).json({ message: 'Error fetching recent activity' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.updateUserRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'name');
    res.json(recipes);
  } catch (error) {
    console.error('Error in getRecipes:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};

exports.updateRecipeStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error in updateRecipeStatus:', error);
    res.status(500).json({ message: 'Error updating recipe status' });
  }
};

exports.getFeaturedRecipes = async (req, res) => {
  try {
    const featuredRecipes = await Recipe.find({ featured: true }).populate('createdBy', 'name');
    res.json(featuredRecipes);
  } catch (error) {
    console.error('Error in getFeaturedRecipes:', error);
    res.status(500).json({ message: 'Error fetching featured recipes' });
  }
};

exports.getBlogPosts = async (req, res) => {
  try {
    // Assuming you have a BlogPost model
    const BlogPost = require('../models/BlogPost');
    const blogPosts = await BlogPost.find().sort('-createdAt').populate('author', 'name');
    res.json(blogPosts);
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const userGrowth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const recipeGrowth = await Recipe.countDocuments({ createdAt: { $gte: lastMonth } });
    const commentGrowth = await Comment.countDocuments({ createdAt: { $gte: lastMonth } });

    const topCategories = await Recipe.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const analytics = {
      userGrowth,
      recipeGrowth,
      commentGrowth,
      topCategories
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'name')
      .populate('recipe', 'title')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    console.error('Error in getComments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

exports.updateCommentStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error in updateCommentStatus:', error);
    res.status(500).json({ message: 'Error updating comment status' });
  }
};

exports.sendNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Implement your notification logic here
    // This could involve sending emails, push notifications, or saving to a notifications collection
    const { title, content, recipients } = req.body;

    // For demonstration, we'll just log the notification
    console.log(`Sending notification: ${title} to ${recipients}`);

    // In a real implementation, you might use a service like Firebase Cloud Messaging or send emails

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error in sendNotification:', error);
    res.status(500).json({ message: 'Error sending notification' });
  }
};

exports.getAppSettings = async (req, res) => {
  try {
    let settings = await AppSettings.findOne();
    if (!settings) {
      settings = await AppSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error('Error in getAppSettings:', error);
    res.status(500).json({ message: 'Error fetching app settings' });
  }
};

exports.updateAppSettings = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const settings = await AppSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json(settings);
  } catch (error) {
    console.error('Error in updateAppSettings:', error);
    res.status(500).json({ message: 'Error updating app settings' });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error in getAdminProfile:', error);
    res.status(500).json({ message: 'Error fetching admin profile' });
  }
};

exports.updateAdminProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const admin = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error in updateAdminProfile:', error);
    res.status(500).json({ message: 'Error updating admin profile' });
  }
};

exports.changeAdminPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    admin.password = req.body.newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in changeAdminPassword:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};