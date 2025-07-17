import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        console.error("❌ MONGO_URI is not defined in .env");
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB connected successfully");
    }
    catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

export default connectDB;
