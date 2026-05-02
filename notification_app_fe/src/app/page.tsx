"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Pagination,
  CircularProgress, Alert
} from "@mui/material";
import { Notification, NotificationType } from "@/types/notification";
import { fetchNotifications } from "@/lib/api";
import NotificationCard from "@/components/NotificationCard";
import NotificationFilters from "@/components/NotificationFilters";
import { Log } from "@/logger";

export default function HomePage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationType>("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const limit = 5;

  useEffect(() => { loadNotifications(); }, [filter, page]);

  async function loadNotifications() {
    setLoading(true);
    setError("");
    await Log("frontend", "info", "page", `Loading page:${page} filter:${filter}`);
    try {
      const data = await fetchNotifications(page, limit, filter);
      setNotifications(data);
    } catch (err) {
      setError("Failed to load. Is backend running on port 3001?");
      await Log("frontend", "error", "page", `Failed: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  function markAsRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
    Log("frontend", "info", "page", `Marked as read: ${id}`);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">📢 All Notifications</Typography>
        <a href="/priority" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
          ⭐ Priority Inbox →
        </a>
      </Box>

      <NotificationFilters
        selected={filter}
        onChange={(type) => { setFilter(type); setPage(1); }}
      />

      {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && notifications.map((n) => (
        <NotificationCard key={n.ID} notification={n} isRead={readIds.has(n.ID)} onRead={markAsRead} />
      ))}
      {!loading && notifications.length === 0 && !error && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination count={10} page={page} onChange={(_, val) => setPage(val)} color="primary" />
      </Box>
    </Container>
  );
}