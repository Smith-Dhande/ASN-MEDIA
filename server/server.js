require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Middleware imports
const { requestLogger } = require('./middleware/loggerMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const clientRoutes = require('./routes/clientRoutes');
const leadRoutes = require('./routes/leadRoutes');
const packageRoutes = require('./routes/packageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const scannerRoutes = require('./routes/scannerRoutes');
const staffRoutes = require('./routes/staffRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingRoutes = require('./routes/settingRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Base Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'ASN Digital Media Backend API Server',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Mount Module API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/scanners', scannerRoutes);
app.use('/api/review-scanners', scannerRoutes); // Alias for backwards compatibility
app.use('/api/staff', staffRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/activity-logs', activityRoutes); // Alias
app.use('/api/settings', settingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 ASN DIGITAL MEDIA API Server running on port ${PORT}`);
});
