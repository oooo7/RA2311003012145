import { Notification } from "@/types/notification";
import { Log } from "@/logger";

const BACKEND_URL = "http://localhost:3001";

export async function fetchNotifications(
  page: number = 1,
  limit: number = 10,
  notification_type?: string
): Promise<Notification[]> {
  await Log("frontend", "info", "api", `Fetching notifications page:${page} limit:${limit} type:${notification_type}`);
  try {
    let url = `${BACKEND_URL}/api/notifications?page=${page}&limit=${limit}`;
    if (notification_type && notification_type !== "All") {
      url += `&notification_type=${notification_type}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    await Log("frontend", "info", "api", `Fetched ${data.notifications?.length} notifications`);
    return data.notifications || [];
  } catch (error) {
    await Log("frontend", "error", "api", `Failed to fetch notifications: ${error}`);
    return [];
  }
}

export async function fetchPriorityNotifications(n: number = 10): Promise<Notification[]> {
  await Log("frontend", "info", "api", `Fetching top ${n} priority notifications`);
  try {
    const response = await fetch(`${BACKEND_URL}/api/notifications/priority?n=${n}`);
    const data = await response.json();
    await Log("frontend", "info", "api", `Fetched ${data.notifications?.length} priority notifications`);
    return data.notifications || [];
  } catch (error) {
    await Log("frontend", "error", "api", `Failed to fetch priority notifications: ${error}`);
    return [];
  }
}