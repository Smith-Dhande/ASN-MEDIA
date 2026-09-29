import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import reviewScannerRoutes from './routes/reviewScanner.routes.js';
import clientRoutes from './routes/client.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'ASN Media Review Scanner API', timestamp: new Date() });
});

// API Routes
app.use('/api/review-scanners', reviewScannerRoutes);
app.use('/api/clients', clientRoutes);

// Connect DB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ASN Media Server running on port ${PORT}`);
  });
});
