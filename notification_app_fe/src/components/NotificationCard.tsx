"use client";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { Notification } from "@/types/notification";

interface Props {
  notification: Notification;
  isRead: boolean;
  onRead: (id: string) => void;
}

const typeColors: Record<string, "error" | "warning" | "info"> = {
  Placement: "error",
  Result: "warning",
  Event: "info",
};

export default function NotificationCard({ notification, isRead, onRead }: Props) {
  return (
    <Card
      onClick={() => onRead(notification.ID)}
      sx={{
        mb: 2,
        cursor: "pointer",
        backgroundColor: isRead ? "#f5f5f5" : "#ffffff",
        borderLeft: isRead ? "4px solid #ccc" : "4px solid #1976d2",
        boxShadow: isRead ? 1 : 3,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Chip label={notification.Type} color={typeColors[notification.Type] || "info"} size="small" />
          {!isRead && <Chip label="NEW" color="primary" size="small" variant="outlined" />}
        </Box>
        <Typography variant="body1" fontWeight={isRead ? "normal" : "bold"}>
          {notification.Message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(notification.Timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}