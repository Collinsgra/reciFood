require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const verifyAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin@koch358.com';
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user found:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isAdmin: admin.isAdmin,
      passwordHash: admin.password.substring(0, 10) + '...' // Show only part of the hash for security
    });

    // Test password comparison
    const testPassword = '358koch811@';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log(`Password '${testPassword}' matches: ${isMatch}`);

  } catch (error) {
    console.error('Error verifying admin password:', error);
  } finally {
    await mongoose.disconnect();
  }
};

verifyAdminPassword();