const SiteSettings = require('../models/SiteSettings');

const BUSINESS_DEFAULTS = {
  contact: {
    studioName: 'Blooms & Looms',
    city: 'Kolhapur, Maharashtra',
    phone: '+91 9632982631',
    email: 'bloomsnlooms@gmail.com',
    businessHours: ['Mon-Sat: 10 AM - 7 PM', 'Sunday: By appointment'],
  },
  payment: {
    upiId: 'blooms@upi',
    qrCodeUrl: '/images/qr.png',
  },
};

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne({ key: 'default' });
  if (!settings) {
    settings = await SiteSettings.create({ key: 'default', ...BUSINESS_DEFAULTS });
  }
  return settings;
};

exports.getPublicSettings = async (_req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    const { contact, payment } = req.body;

    if (contact) {
      settings.contact = {
        ...settings.contact.toObject(),
        ...contact,
      };
    }

    if (payment) {
      settings.payment = {
        ...settings.payment.toObject(),
        ...payment,
      };
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
