import ConnectAccount from "../components/ConnectAccount";
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Register from "../components/Register";
import { useAdmin } from "contexts/AdminContext";
import { useNavigate } from "react-router-dom";

const CustomHeader: React.FC = () => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    
    navigate( "/admin/add-bet");
  };


  const navigateHome = () => {
    navigate("/");
  };
  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Box>
              <Register />
            </Box>
          </Typography>
          {isAdmin && (
            <Button onClick={handleAdminClick}>Admin Dashboard</Button>
          )}
          <Button onClick={navigateHome}>Home</Button>
          <Box>
            <ConnectAccount />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default CustomHeader;
