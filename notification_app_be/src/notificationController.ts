// notificationController.ts
// Handles HTTP requests and sends responses
// Calls the service layer to get data

import { Request, Response } from "express";
import { fetchAllNotifications, getPriorityNotifications } from "./notificationService";
import { Log } from "../../logging_middleware/logger";

// ─────────────────────────────────────────────
// getAllNotifications
// GET /api/notifications
// Query params: limit, page, notification_type
// ─────────────────────────────────────────────
export async function getAllNotifications(req: Request, res: Response): Promise<void> {
  await Log("backend", "info", "controller", "GET /api/notifications called");

  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const notification_type = req.query.notification_type as string | undefined;

    const notifications = await fetchAllNotifications(limit, page, notification_type);

    await Log("backend", "info", "controller", `Returning ${notifications.length} notifications to client`);
    res.status(200).json({ success: true, notifications });

  } catch (error) {
    await Log("backend", "error", "controller", `Error in getAllNotifications: ${error}`);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
}

// ─────────────────────────────────────────────
// getTopPriorityNotifications
// GET /api/notifications/priority
// Query params: n (how many top notifications)
// ─────────────────────────────────────────────
export async function getTopPriorityNotifications(req: Request, res: Response): Promise<void> {
  await Log("backend", "info", "controller", "GET /api/notifications/priority called");

  try {
    const n = req.query.n ? parseInt(req.query.n as string) : 10;

    await Log("backend", "debug", "controller", `Requesting top ${n} priority notifications`);
    const notifications = await getPriorityNotifications(n);

    await Log("backend", "info", "controller", `Returning ${notifications.length} priority notifications to client`);
    res.status(200).json({ success: true, notifications });

  } catch (error) {
    await Log("backend", "error", "controller", `Error in getTopPriorityNotifications: ${error}`);
    res.status(500).json({ success: false, message: "Failed to fetch priority notifications" });
  }
}