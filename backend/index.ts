import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRouter from "./routes/todo";
import userRouter from "./routes/user";
import { optionalEnv } from "./config/env";
import { connectToDatabase } from "./config/database";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use((req, res, next) => {
  console.log("Received request:", req.method, req.url);
  next();
});

const frontendUrl = optionalEnv("FRONTEND_URL");
if (!frontendUrl) {
  console.warn("WARNUNG: FRONTEND_URL ist nicht definiert. CORS ist möglicherweise nicht korrekt konfiguriert.");
}

app.use(
  cors({
    origin: frontendUrl ? [frontendUrl] : ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(async (_req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    res.status(500).json({ error: "Database connection error" });
  }
});

app.use("/todos", todoRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
