// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from "cors";
import router from './routes/AppRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth",router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
