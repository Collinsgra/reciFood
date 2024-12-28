const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
  appName: {
    type: String,
    default: 'Recipe App'
  },
  logo: {
    type: String,
    default: '/default-logo.png'
  },
  allowUserRegistration: {
    type: Boolean,
    default: true
  },
  enableComments: {
    type: Boolean,
    default: true
  },
  enableRatings: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  }
}, {
  timestamps: true
});

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);

module.exports = AppSettings;