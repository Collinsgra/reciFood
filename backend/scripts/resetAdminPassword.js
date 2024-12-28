require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin@koch358.com';
    const newPassword = '358koch811@'; // Using the password you attempted to log in with

    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    admin.password = newPassword;
    await admin.save();

    console.log('Admin password reset successfully');
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
  }
};

resetAdminPassword();