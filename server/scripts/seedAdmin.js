require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Staff = require('../models/Staff');
const Setting = require('../models/Setting');

const ADMIN_DATA = {
  name: process.env.ADMIN_NAME || 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@asnmedia.in',
  password: process.env.ADMIN_PASSWORD || 'Pass123',
  role: 'Super Admin',
  designation: 'Super Administrator',
  phone: '+91 98765 43210',
  avatar: 'AD',
  status: 'Active'
};

async function seedAdmin() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asn_digital_media';

  console.log('Connecting to MongoDB at:', mongoUri);
  await mongoose.connect(mongoUri);

  const cleanEmail = ADMIN_DATA.email.toLowerCase().trim();

  let admin = await Staff.findOne({ email: cleanEmail }).select('+password');

  if (admin) {
    console.log(`Found existing staff account for ${cleanEmail}. Updating credentials...`);
    admin.name = ADMIN_DATA.name;
    admin.role = ADMIN_DATA.role;
    admin.designation = ADMIN_DATA.designation;
    admin.phone = ADMIN_DATA.phone;
    admin.avatar = ADMIN_DATA.avatar;
    admin.status = ADMIN_DATA.status;
    admin.password = ADMIN_DATA.password; // Triggers pre('save') bcrypt hashing
    await admin.save();
    console.log(`Successfully updated admin user: ${admin.email}`);
  } else {
    console.log(`Creating new Super Admin account: ${cleanEmail}...`);
    admin = new Staff(ADMIN_DATA);
    await admin.save();
    console.log(`Successfully created Super Admin user: ${admin.email}`);
  }

  // Verify password matches
  const verifyAdmin = await Staff.findOne({ email: cleanEmail }).select('+password');
  const isMatch = await verifyAdmin.matchPassword(ADMIN_DATA.password);
  console.log(`Password verification test: ${isMatch ? 'PASSED (valid hash)' : 'FAILED'}`);

  // Sync with global settings
  try {
    await Setting.findOneAndUpdate(
      { key: 'global_settings' },
      {
        $set: {
          'adminProfile.name': admin.name,
          'adminProfile.email': admin.email,
          'adminProfile.phone': admin.phone,
          'adminProfile.role': admin.role,
          'adminProfile.designation': admin.designation,
          'adminProfile.avatar': admin.avatar
        }
      },
      { upsert: true }
    );
    console.log('Synchronized admin profile with global system settings.');
  } catch (err) {
    console.warn('Could not sync Setting model:', err.message);
  }

  console.log('\n========================================');
  console.log('Admin Seeding Completed Successfully:');
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${ADMIN_DATA.password}`);
  console.log(`  Role:     ${admin.role}`);
  console.log(`  Status:   ${admin.status}`);
  console.log('========================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Error seeding admin user:', err);
  process.exit(1);
});
