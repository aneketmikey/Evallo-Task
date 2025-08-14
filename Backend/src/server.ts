import express from "express";
import logsRouter from "./routes/logs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.BACKEND_SERVER_PORT
  ? parseInt(process.env.BACKEND_SERVER_PORT, 10)
  : 3000;

app.use(cors());
// middlewares
app.use(express.json({ limit: "1mb" }));

// routes
app.use("/api/v1/logs", logsRouter);

// health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Log service listening on http://localhost:${PORT}`);
});
