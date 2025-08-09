import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectTodb from "./db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

connectTodb();
dotenv.config();

const app = express();

// ✅ Configure CORS properly
const corsOptions = {
    origin: "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", taskRoutes);
app.use("/api/auth", authRoutes);



// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
