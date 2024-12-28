require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin@koch358.com';
    const admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user found:', {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin
      });
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkAdminUser();