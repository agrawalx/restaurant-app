import express from 'express';
import {connectDB} from './config/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js";
import cookieParser from 'cookie-parser';
import reservationRoutes from './routes/reservationRoute.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "https://restaurant-app-zry4.vercel.app",
    "http://localhost:3000",
    "https://restaurant-app-zry4-git-main-yash-agrawal-s-projects.vercel.app"
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);

// Connect to database first
let dbConnection;
try {
    dbConnection = await connectDB();
    console.log('Database connection established');
} catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
}

// Start server only after DB connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Routes
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use("", authRoutes);
app.use("/reservation", reservationRoutes);
app.use("/admin/restaurant", restaurantRoutes);
app.use("/restaurant", restaurantRoutes);

// Test endpoint
app.get('/test-db-connection', async (req, res) => {
    try {
        // Better way to check MongoDB connection
        const pingResult = await mongoose.connection.db.command({ ping: 1 });
        
        res.status(200).json({
            success: true,
            message: 'Database connected successfully',
            connectionStatus: mongoose.connection.readyState, // 1 = connected
            pingResult,
            dbInfo: {
                host: mongoose.connection.host,
                name: mongoose.connection.name,
                port: mongoose.connection.port
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            connectionStatus: mongoose.connection.readyState,
            suggestion: 'Check your MONGO_URI and ensure the database is accessible'
        });
    }
});