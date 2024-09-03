"use client";
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText } from "@mui/material";
import NavBar from "../components/NavBar";

export default function MedicalReminders() {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [intervalType, setIntervalType] = useState("");
  const [intervalValue, setIntervalValue] = useState("");

  const handleAddReminder = () => {
    if (medicineName && medicineType && intervalType && intervalValue) {
      const newReminder = {
        name: medicineName,
        type: medicineType,
        interval: `${intervalValue} ${intervalType}`,
      };
      setReminders([...reminders, newReminder]);
      setMedicineName("");
      setMedicineType("");
      setIntervalType("");
      setIntervalValue("");
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "black", minHeight: "100vh" }}>
      <NavBar />
      <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
        Medical Reminders
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <TextField
          label="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          sx={{ flexGrow: 1, backgroundColor: "white", borderRadius: "4px" }}
        />

        <FormControl sx={{ minWidth: "150px", backgroundColor: "white", borderRadius: "4px" }}>
          <InputLabel>Medicine Type</InputLabel>
          <Select
            value={medicineType}
            onChange={(e) => setMedicineType(e.target.value)}
          >
            <MenuItem value="Pill">Pill</MenuItem>
            <MenuItem value="Liquid">Liquid</MenuItem>
            <MenuItem value="Injection">Injection</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Interval Value"
          type="number"
          value={intervalValue}
          onChange={(e) => setIntervalValue(e.target.value)}
          sx={{ width: "100px", backgroundColor: "white", borderRadius: "4px" }}
        />

        <FormControl sx={{ minWidth: "120px", backgroundColor: "white", borderRadius: "4px" }}>
          <InputLabel>Interval Type</InputLabel>
          <Select
            value={intervalType}
            onChange={(e) => setIntervalType(e.target.value)}
          >
            <MenuItem value="hour(s)">Hour(s)</MenuItem>
            <MenuItem value="day(s)">Day(s)</MenuItem>
            <MenuItem value="week(s)">Week(s)</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReminder}
          sx={{ height: "56px" }}
        >
          Add Reminder
        </Button>
      </Box>

      <Typography variant="h6" sx={{ color: "white" }}>Reminders</Typography>
      <List>
        {reminders.map((reminder, index) => (
          <ListItem key={index} sx={{ backgroundColor: "white", marginBottom: "10px", borderRadius: "4px" }}>
            <ListItemText
              primary={`${reminder.name} (${reminder.type})`}
              secondary={`Every ${reminder.interval}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
