// notificationService.ts
// Handles ALL business logic:
// 1. Getting auth token
// 2. Fetching notifications from Affordmed API
// 3. Sorting by priority (placement > result > event) and recency
// 4. Returning top N notifications

import config from "./config";
import { Log } from "./logger";

// Token stored in memory - reused until it expires
let authToken: string | null = null;

// Priority weights - higher number = more important
const PRIORITY_WEIGHTS: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// ─────────────────────────────────────────────
// getAuthToken
// Fetches a fresh Bearer token from Affordmed
// ─────────────────────────────────────────────
async function getAuthToken(): Promise<string> {
  await Log("backend", "info", "service", "Fetching fresh auth token from Affordmed");

  const response = await fetch(config.authAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: config.email,
      name: config.name,
      rollNo: config.rollNo,
      accessCode: config.accessCode,
      clientID: config.clientID,
      clientSecret: config.clientSecret,
    }),
  });

  if (!response.ok) {
    await Log("backend", "error", "service", `Auth token fetch failed: ${response.status}`);
    throw new Error(`Auth failed: ${response.status}`);
  }

  const data = await response.json();
  await Log("backend", "info", "service", "Auth token fetched successfully");
  return data.access_token;
}

// ─────────────────────────────────────────────
// ensureToken
// Returns existing token or fetches a new one
// ─────────────────────────────────────────────
async function ensureToken(): Promise<string> {
  if (!authToken) {
    authToken = await getAuthToken();
  }
  return authToken;
}

// ─────────────────────────────────────────────
// fetchAllNotifications
// Fetches notifications from Affordmed API
// Handles token expiry automatically
// ─────────────────────────────────────────────
export async function fetchAllNotifications(
  limit?: number,
  page?: number,
  notification_type?: string
): Promise<any[]> {
  await Log("backend", "info", "service", `Fetching notifications - limit:${limit} page:${page} type:${notification_type}`);

  try {
    const token = await ensureToken();

    // Build URL with query params
    const url = new URL(config.affordmedAPI);
    if (limit) url.searchParams.append("limit", limit.toString());
    if (page) url.searchParams.append("page", page.toString());
    if (notification_type) url.searchParams.append("notification_type", notification_type);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      await Log("backend", "warn", "service", "Token expired, refreshing and retrying");
      authToken = null;
      const freshToken = await ensureToken();

      const retryResponse = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`,
        },
      });

      const retryData = await retryResponse.json();
      return retryData.notifications || [];
    }

    const data = await response.json();
    await Log("backend", "info", "service", `Fetched ${data.notifications?.length || 0} notifications`);
    return data.notifications || [];

  } catch (error) {
    await Log("backend", "error", "service", `Failed to fetch notifications: ${error}`);
    throw error;
  }
}

// ─────────────────────────────────────────────
// getPriorityNotifications
// Returns top N notifications sorted by:
// 1. Type weight (Placement > Result > Event)
// 2. Recency (newer first)
// Uses a simple but efficient scoring system
// ─────────────────────────────────────────────
export async function getPriorityNotifications(topN: number = 10): Promise<any[]> {
  await Log("backend", "info", "service", `Computing top ${topN} priority notifications`);

  try {
    const notifications = await fetchAllNotifications();

    // Score each notification
    // Score = (priority weight * large number) + timestamp
    // This ensures type always beats recency, but within same type newer wins
    const scored = notifications.map((n) => {
      const weight = PRIORITY_WEIGHTS[n.Type] || 0;
      const timestamp = new Date(n.Timestamp).getTime();
      const score = weight * 1_000_000_000_000 + timestamp;
      return { ...n, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Return only top N
    const topNotifications = scored.slice(0, topN).map(({ score, ...n }) => n);

    await Log("backend", "info", "service", `Returning top ${topNotifications.length} priority notifications`);
    return topNotifications;

  } catch (error) {
    await Log("backend", "error", "service", `Failed to compute priority notifications: ${error}`);
    throw error;
  }
}