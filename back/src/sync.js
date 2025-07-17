// scripts/syncIndexes.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FraudReport, { fraudReportSchema } from './models/FraudReport.js';

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const indexes = await FraudReport.syncIndexes();
        console.log("Defined Indexes:", fraudReportSchema.indexes());

        console.log('✅ Indexes created:', indexes);

        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    } catch (err) {
        console.error('❌ Error syncing indexes:', err.message);
        process.exit(1);
    }
}

run();
