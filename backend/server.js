import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", chatRoutes);

// Serve frontend build if present
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));
app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(publicDir, "index.html"));
  } catch {
    res.status(404).send("Frontend not built. Run `npm run build-frontend` in backend.");
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/career_chat";

mongoose
  .connect(MONGO_URI, { })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
