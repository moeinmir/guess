// components/Admin/AdminDashboard.tsx
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';


const AdminDashboard = () => {
  const location = useLocation();
  const [tabValue] = useState(
    location.pathname.includes('add-bet') ? 0 :
    location.pathname.includes('close-bet') ? 1 :
    location.pathname.includes('settings') ? 2 : 0
  );

  return (
    <Box>
      <Tabs value={tabValue} centered>
        <Tab 
          label="Add Bet" 
          component={Link} 
          to="add-bet" 
        />
        <Tab 
          label="Close Bet" 
          component={Link} 
          to="close-bet" 
        />
        <Tab 
          label="Settings" 
          component={Link} 
          to="settings" 
        />
      </Tabs>
      
      <Box mt={3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;