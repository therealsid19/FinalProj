"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, IconButton, Snackbar } from "@mui/material";
import { useUser } from '@clerk/nextjs';
import Calendar from 'react-calendar';
import { deleteReminder, getReminders, addReminder, updateReminder } from '@/lib/reminders';
import NavBar from "../components/NavBar";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles
import './react-calendar.css';
import { color } from "framer-motion";

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
      const userEmail = user.emailAddresses[0]['emailAddress'];
      const reminder = await addReminder(user.id, newReminder, userEmail);
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
        date: selectedDate.toISOString().split('T')[0],
      };
      const userEmail = user.emailAddresses[0]['emailAddress'];
      const reminder = await updateReminder(user.id, updatedReminder, userEmail);
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
    await deleteReminder(user.id, selectedDate, id);
    setReminders(reminders.filter(rem => rem.id !== id));
    setOpenSnackbar(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Box sx={{ background:'linear-gradient(180deg, #0c4ca6, #1c68d4, #2b8fd6, #30b4cf)', color: "white"}}>
      <NavBar />
      <Box sx={{ padding: '5px'}}>
      <Typography variant="h4" gutterBottom sx={{ color: "#E0E0E0", textAlign: "center", marginBottom: "30px", marginTop: '20px' }}>
        Medical Reminders
      </Typography>

      <Box sx={{ 
        marginBottom: "30px", 
        padding: "20px", 
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        borderRadius: "8px", 
        display: "flex", 
        flexWrap: "wrap",  
        gap: "5px",  
        justifyContent: "space-between"  }}>
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
    
      <Box
        sx={{
            display: "flex", 
            justifyContent: "space-between",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
        >
        <Box sx={{ flex: 1, marginRight: "20px" }}>
            <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="react-calendar"
            tileClassName={({ date }) =>
                date.toDateString() === selectedDate.toDateString() ? 'highlight' : undefined
            }
            />
        </Box>

        <Box sx={{ flex: 2 }}>
            <Typography variant="h6" sx={{ color: "lightgray" }}>
            Reminders for {selectedDate.toDateString()}
            </Typography>
            <List>
            {reminders.map((reminder) => (
                <ListItem
                key={reminder.id}
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    padding: "10px",
                }}
                >
                <ListItemText
                    primary={`${reminder.name} (${reminder.type})`}
                    secondary={`Time: ${reminder.time}`}
                    sx={{
                        '& .MuiListItemText-secondary': {
                        color: 'white', 
                        },
                    }}
                />
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => handleEditReminder(reminder)}
                >
                    <MdEdit />
                </IconButton>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => handleDeleteReminder(reminder.id)}
                >
                    <RiDeleteBin5Fill />
                </IconButton>
                </ListItem>
            ))}
            </List>
        </Box>
        </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Action successful"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
    </Box>
  );
}
