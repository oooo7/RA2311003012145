"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Slider,
  CircularProgress, Alert
} from "@mui/material";
import { Notification, NotificationType } from "@/types/notification";
import { fetchPriorityNotifications } from "@/lib/api";
import NotificationCard from "@/components/NotificationCard";
import NotificationFilters from "@/components/NotificationFilters";
import { Log } from "@/logger";

export default function PriorityPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filtered, setFiltered] = useState<Notification[]>([]);
  const [topN, setTopN] = useState(10);
  const [filter, setFilter] = useState<NotificationType>("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => { loadPriority(); }, [topN]);
  useEffect(() => { applyFilter(); }, [notifications, filter]);

  async function loadPriority() {
    setLoading(true);
    setError("");
    await Log("frontend", "info", "page", `Loading top ${topN} priority notifications`);
    try {
      const data = await fetchPriorityNotifications(topN);
      setNotifications(data);
    } catch (err) {
      setError("Failed to load priority notifications.");
      await Log("frontend", "error", "page", `Failed: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  function applyFilter() {
    if (filter === "All") setFiltered(notifications);
    else setFiltered(notifications.filter((n) => n.Type === filter));
  }

  function markAsRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
    Log("frontend", "info", "page", `Marked as read: ${id}`);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">⭐ Priority Inbox</Typography>
        <a href="/" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
          ← All Notifications
        </a>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Show top <strong>{topN}</strong> notifications</Typography>
        <Slider
          value={topN}
          min={5} max={20} step={5}
          marks={[{value:5,label:"5"},{value:10,label:"10"},{value:15,label:"15"},{value:20,label:"20"}]}
          onChange={(_, val) => setTopN(val as number)}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <NotificationFilters selected={filter} onChange={(type) => setFilter(type)} />

      {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && filtered.map((n) => (
        <NotificationCard key={n.ID} notification={n} isRead={readIds.has(n.ID)} onRead={markAsRead} />
      ))}
      {!loading && filtered.length === 0 && !error && (
        <Alert severity="info">No notifications found.</Alert>
      )}
    </Container>
  );
}