import mongoose from "mongoose";
import dns from "dns";

// Force Node's internal DNS resolver to use Google's public DNS.
// Fixes "querySrv ECONNREFUSED" errors on some Windows networks where
// Node's resolver doesn't pick up the OS-level DNS settings.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
