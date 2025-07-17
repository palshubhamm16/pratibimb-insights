import mongoose from 'mongoose';

const fraudReportSchema = new mongoose.Schema({
    suspectNumber: String,
    imei: String,
    provider: String,
    fetchedDate: Date,
    fetchedTime: String,
    state: String,
    district: String,
    address: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    victim: {
        ackNumber: String,
        name: String,
        phone: String,
        district: String,
        state: String
    },
    category: String,
    amount: Number
}, { timestamps: true });

// ✅ Indexes before model compilation
fraudReportSchema.index({ state: 1 });
fraudReportSchema.index({ district: 1 });
fraudReportSchema.index({ fetchedDate: 1 });
fraudReportSchema.index({ suspectNumber: 1 });
fraudReportSchema.index({ category: 1 });
fraudReportSchema.index({ "victim.state": 1 });

const FraudReport = mongoose.model('FraudReport', fraudReportSchema);
export { fraudReportSchema };             //exporting schema for sync script
export default FraudReport;