// app.ts
// Entry point of the backend server
// Sets up Express, middleware, and routes

import express from "express";
import cors from "cors";
import config from "./config";
import notificationRoutes from "./notificationRoutes";
import { Log } from "./logger";

const app = express();

// Allow frontend (running on port 3000) to call this backend
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Health check route
app.get("/health", async (req, res) => {
  await Log("backend", "info", "route", "Health check endpoint called");
  res.status(200).json({ status: "ok", message: "Notification backend is running" });
});

// All notification routes under /api/notifications
app.use("/api/notifications", notificationRoutes);

// Start server
app.listen(config.port, async () => {
  await Log("backend", "info", "route", `Backend server started on port ${config.port}`);
  process.stdout.write(`Server running on http://localhost:${config.port}\n`);
});

export default app;