// notificationRoutes.ts
// Defines all API routes for the notification system

import { Router } from "express";
import { getAllNotifications, getTopPriorityNotifications } from "./notificationController";

const router = Router();

// GET /api/notifications - fetch all notifications
router.get("/", getAllNotifications);

// GET /api/notifications/priority - fetch top N priority notifications
router.get("/priority", getTopPriorityNotifications);

export default router;