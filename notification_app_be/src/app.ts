import express from "express";
import cors from "cors";
import config from "./config";
import notificationRoutes from "./notificationRoutes";
import { Log } from "./logger";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", async (req, res) => {
  await Log("backend", "info", "route", "Health check called");
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/notifications", notificationRoutes);

app.listen(config.port, async () => {
  await Log("backend", "info", "route", `Server started on port ${config.port}`);
  process.stdout.write(`Server running on http://localhost:${config.port}\n`);
});

export default app;