import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import uploadRoutes from './routes/uploadRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import countryRoutes from "./routes/countryRoutes.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/uploads', uploadRoutes);
app.use('/api/states', stateRoutes);
app.use("/api/country", countryRoutes);


connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

})