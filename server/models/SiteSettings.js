const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    contact: {
      studioName: { type: String, default: 'Blooms & Looms' },
      city: { type: String, default: 'Kolhapur, Maharashtra' },
      phone: { type: String, default: '+91 9632982631' },
      email: { type: String, default: 'bloomsnlooms@gmail.com' },
      businessHours: {
        type: [String],
        default: ['Mon-Sat: 10 AM - 7 PM', 'Sunday: By appointment'],
      },
    },
    payment: {
      upiId: { type: String, default: 'blooms@upi' },
      qrCodeUrl: { type: String, default: '/images/qr.png' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
