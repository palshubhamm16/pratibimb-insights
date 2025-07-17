import fs from 'fs';
import csv from 'csv-parser';
import FraudReport from '../models/FraudReport.js';
import cleanRow from '../utils/cleanRow.js';

export const uploadCSV = async (req, res) => {
    const filePath = req.file.path;
    const batch = [];
    const failedRows = [];
    const BATCH_SIZE = 500;

    const flushBatch = async () => {
        if (batch.length > 0) {
            try {
                await FraudReport.insertMany(batch);
                batch.length = 0;
            } catch (err) {
                console.error('❌ Error inserting batch:', err.message);
                // Optional: Save failed batch somewhere if needed
            }
        }
    };

    try {
        const stream = fs.createReadStream(filePath).pipe(csv());

        stream.on('data', (row) => {
            try {
                const cleaned = cleanRow(row);
                batch.push(cleaned);

                if (batch.length >= BATCH_SIZE) {
                    stream.pause(); // pause stream during DB write
                    flushBatch().then(() => stream.resume());
                }
            } catch (err) {
                console.error('⚠️ Error cleaning row:', err.message);
                failedRows.push(row);
            }
        });

        stream.on('end', async () => {
            await flushBatch();

            fs.unlink(filePath, (err) => {
                if (err) console.warn('⚠️ Could not delete temp file:', err.message);
            });

            res.status(201).json({
                success: true,
                message: '✅ CSV uploaded and cleaned.',
                failedRows: failedRows.length
            });
        });

        stream.on('error', (err) => {
            console.error('❌ Stream error:', err.message);
            res.status(500).json({ success: false, error: 'CSV stream error' });
        });

    } catch (err) {
        console.error('❌ Failed to process CSV:', err.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
