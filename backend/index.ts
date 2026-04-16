import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRouter from "./routes/todo";
import userRouter from "./routes/user";

dotenv.config();

const app = express();
const port = 3001;
mongoose
  .connect(process.env.DB_URL as string, { dbName: "todo-mern-app" })
  .then(() => {
    console.log("Connected to DB:", mongoose.connection.db?.databaseName);
  });

app.use((req, res, next) => {
  console.log("Received request:", req.method, req.url);
  console.log(".env", process.env.FRONTEND_URL);
  next();
});

const frontendUrl = process.env.FRONTEND_URL;
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

app.use("/todos", todoRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
