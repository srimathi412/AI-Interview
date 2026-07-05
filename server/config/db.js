import mongoose from 'mongoose';

const connectionOptions = {
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000,
};

const connectDB = async () => {
  const srvUri = process.env.MONGODB_URI;
  const directUri = process.env.MONGODB_URI_DIRECT;

  if (!srvUri && !directUri) {
    console.error('MongoDB Connection Error: MONGODB_URI is not defined in server/.env');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);

  const tryConnect = async (uri, label) => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    const conn = await mongoose.connect(uri, connectionOptions);
    console.log(`MongoDB Connected (${label}): ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  };

  // Prefer direct URI on Windows (avoids querySrv ECONNREFUSED / slow timeouts)
  if (directUri) {
    try {
      return await tryConnect(directUri, 'direct');
    } catch (directError) {
      console.warn(`Direct connection failed: ${directError.message}`);
      if (!srvUri) {
        console.error('MongoDB Connection Error: No fallback URI available');
        process.exit(1);
      }
      console.warn('Retrying with SRV URI...');
    }
  }

  if (srvUri) {
    try {
      return await tryConnect(srvUri, 'SRV');
    } catch (error) {
      if (directUri) {
        console.warn('SRV failed — retrying direct URI...');
        try {
          return await tryConnect(directUri, 'direct fallback');
        } catch (fallbackError) {
          console.error(`MongoDB Connection Error: ${fallbackError.message}`);
          process.exit(1);
        }
      }
      console.error(`MongoDB Connection Error: ${error.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
