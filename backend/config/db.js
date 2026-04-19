const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('node:dns/promises');

// Force public DNS servers (fixes querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;