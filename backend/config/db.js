const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const connectInMemoryMongo = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('⚡ Using in-memory MongoDB at', uri);
  return uri;
};

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      uri = await connectInMemoryMongo();
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);

    if (process.env.MONGO_URI) {
      try {
        const uri = await connectInMemoryMongo();
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected Successfully (in-memory fallback)');
      } catch (fallbackErr) {
        console.error('❌ In-memory MongoDB fallback failed:', fallbackErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
