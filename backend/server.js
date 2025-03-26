import express from 'express'; 
import { connectDB } from './config/db.js'
import dotenv from 'dotenv';  
import cors from 'cors'
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js"; 
import cookieParser from 'cookie-parser'; 
import reservationRoutes from './routes/reservationRoute.js'
import restaurantRoutes from './routes/restaurantRoutes.js'
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(); 
const app = express(); 
app.use(express.json()); 

const PORT = process.env.PORT || 5000 

app.listen(PORT, () => {
    connectDB(); 
    console.log("server started at http://localhost:" + PORT);
})
const allowedOrigins = [
    "https://restaurant-app-zry4.vercel.app",
    "http://localhost:3000"
]

app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser()); 
app.use("", authRoutes); 
app.use("/reservation", reservationRoutes)
app.use("/admin/restaurant", restaurantRoutes); 
app.use("/restaurant", restaurantRoutes)


app.get('/test-db-connection', async (req, res) => {
    try {
        // For MongoDB, you can ping the database
        await mongoose.connection.db.admin().ping();
        res.status(200).json({ 
            success: true, 
            message: 'Database connected',
            dbHost: mongoose.connection.host,
            dbName: mongoose.connection.name
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error: {
                stack: error.stack,
                connectionStatus: mongoose.connection.readyState
            }
        });
    }
});