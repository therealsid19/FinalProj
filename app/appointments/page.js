"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, IconButton, Snackbar } from "@mui/material";
import { useUser } from '@clerk/nextjs';
import Calendar from 'react-calendar'; // Ensure react-calendar is installed
import { deleteReminder, getReminders, addReminder, updateReminder } from '@/lib/reminders'; // Ensure these functions are defined
import NavBar from "../components/NavBar";

export default function MedicalReminders() {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [time, setTime] = useState("");
  const [amPm, setAmPm] = useState("AM");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingReminder, setEditingReminder] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    console.log('Selected Date:', selectedDate); // Debug log
    if (user && selectedDate) {
      getReminders(user.id, selectedDate).then(setReminders);
    }
  }, [user, selectedDate]);

  const handleAddReminder = async () => {
    if (medicineName && medicineType && time && amPm) {
      const newReminder = {
        name: medicineName,
        type: medicineType,
        time: `${time} ${amPm}`,
        date: selectedDate.toISOString().split('T')[0], // Store date in YYYY-MM-DD format
      };
      
      const reminder = await addReminder(user.id, newReminder);
      setReminders([...reminders, reminder]);
      setMedicineName("");
      setMedicineType("");
      setTime("");
      setAmPm("AM");
      setOpenSnackbar(true);
    }
  };

  const handleEditReminder = (reminder) => {
    setMedicineName(reminder.name);
    setMedicineType(reminder.type);
    const [timePart, amPmPart] = reminder.time.split(' ');
    setTime(timePart);
    setAmPm(amPmPart);
    setEditingReminder(reminder);
  };

  const handleSaveReminder = async () => {
    if (editingReminder) {
      const updatedReminder = {
        ...editingReminder,
        name: medicineName,
        type: medicineType,
        time: `${time} ${amPm}`,
        date: selectedDate.toISOString().split('T')[0], // Store date in YYYY-MM-DD format
      };

      const reminder = await updateReminder(user.id, updatedReminder);
      setReminders(reminders.map(rem => (rem.id === reminder.id ? reminder : rem)));
      setMedicineName("");
      setMedicineType("");
      setTime("");
      setAmPm("AM");
      setEditingReminder(null);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteReminder = async (id) => {
    await deleteReminder(user.id, id);
    setReminders(reminders.filter(rem => rem.id !== id));
    setOpenSnackbar(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Box sx={{ backgroundColor: "black", color: "white", padding: "5px", borderRadius: "8px" }}>
      <NavBar />
      <Typography variant="h4" gutterBottom sx={{ color: "lightgray" }}>
        Medical Reminders
      </Typography>

      <Box sx={{ marginBottom: "20px", padding: "10px", backgroundColor: "#1c1c1c", borderRadius: "8px" }}>
        <TextField
          label="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          sx={{ flexGrow: 1, backgroundColor: "white", borderRadius: "4px", marginBottom: "10px" }}
        />

        <FormControl sx={{ minWidth: "150px", backgroundColor: "white", borderRadius: "4px", marginBottom: "10px" }}>
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
          label="Time"
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          sx={{ width: "100px", backgroundColor: "white", borderRadius: "4px", marginBottom: "10px" }}
        />

        <FormControl sx={{ minWidth: "120px", backgroundColor: "white", borderRadius: "4px", marginBottom: "10px" }}>
          <InputLabel>AM/PM</InputLabel>
          <Select
            value={amPm}
            onChange={(e) => setAmPm(e.target.value)}
          >
            <MenuItem value="AM">AM</MenuItem>
            <MenuItem value="PM">PM</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={editingReminder ? handleSaveReminder : handleAddReminder}
          sx={{ height: "56px", backgroundColor: "#007bff", '&:hover': { backgroundColor: '#0056b3' } }}
        >
          {editingReminder ? "Save Reminder" : "Add Reminder"}
        </Button>
      </Box>

      <Box sx={{ marginBottom: "20px", '& .react-calendar': { backgroundColor: '#1c1c1c', borderRadius: '8px' }, '& .react-calendar__tile': { color: 'white' }, '& .react-calendar__tile--active': { backgroundColor: '#007bff', color: 'white' }, '& .react-calendar__tile--highlighted': { backgroundColor: '#0056b3', color: 'white' } }}>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date }) => date.toDateString() === selectedDate.toDateString() ? 'highlight' : undefined}
        />
      </Box>

      <Typography variant="h6" sx={{ color: "lightgray" }}>Reminders for {selectedDate.toDateString()}</Typography>
      <List>
        {reminders.map((reminder) => (
          <ListItem key={reminder.id} sx={{ backgroundColor: "#2a2a2a", marginBottom: "10px", borderRadius: "4px", padding: "10px" }}>
            <ListItemText 
              primary={`${reminder.name} (${reminder.type})`} 
              secondary={`Time: ${reminder.time}`} 
            />
            <IconButton edge="end" color="inherit" onClick={() => handleEditReminder(reminder)}>
              <i className="fas fa-edit"></i>
            </IconButton>
            <IconButton edge="end" color="inherit" onClick={() => handleDeleteReminder(reminder.id)}>
              <i className="fas fa-trash"></i>
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Action successful"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
