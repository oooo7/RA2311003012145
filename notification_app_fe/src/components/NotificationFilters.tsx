"use client";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { NotificationType } from "@/types/notification";

interface Props {
  selected: NotificationType;
  onChange: (type: NotificationType) => void;
}

const types: NotificationType[] = ["All", "Placement", "Result", "Event"];

export default function NotificationFilters({ selected, onChange }: Props) {
  return (
    <Box mb={3}>
      <Typography variant="subtitle2" mb={1} color="text.secondary">
        Filter by type:
      </Typography>
      <ToggleButtonGroup
        value={selected}
        exclusive
        onChange={(_, val) => val && onChange(val)}
        size="small"
      >
        {types.map((type) => (
          <ToggleButton key={type} value={type}>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}