import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  UserProfile,
} from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ExposureRounded } from '@mui/icons-material';

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    setDrawerOpen(false); // Close the drawer when navigating
    router.push(path);
  };

  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
      <Box sx={{ padding: '10px', textAlign: 'center' }}>
        <SignedOut>
          <Typography variant="h6" component="div"> You need to Login First! </Typography>
        </SignedOut>
        <SignedIn>
          <Typography variant="h6" component="div">
            <UserButton />
          </Typography>
        </SignedIn>
      </Box>
      <ListItem button onClick={() => handleNavigation('/')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <SignedIn>
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/appointments')}>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Appointments" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/chatbot')}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chatbot" />
        </ListItem>
        </SignedIn>
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#0c4ca6' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MediBot
          </Typography>
          <SignedOut>
            <Button color="inherit">Login</Button>
          </SignedOut>
          <SignedIn>
            <Box sx={{ paddingRight: '16px' }}>
              <UserButton />
            </Box>
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList()}
      </Drawer>
    </Box>
  );
}


