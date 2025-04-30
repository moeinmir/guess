// components/Admin/AdminPanel.tsx
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAdmin } from 'contexts/AdminContext';
import { useState } from 'react';

const AdminPanel = () => {
  const { adminAddress, isAdmin, loading, changeAdmin } = useAdmin();
  const [newAdmin, setNewAdmin] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChangeAdmin = async () => {
    if (!newAdmin) return;
    setIsChanging(true);
    try {
      await changeAdmin(newAdmin);
      setNewAdmin('');
    } finally {
      setIsChanging(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Contract Administration
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Current Admin: {adminAddress}
      </Typography>
      
      {isAdmin ? (
        <Box mt={2}>
          <Alert severity="success" sx={{ mb: 2 }}>
            You are the contract admin
          </Alert>
          
          <TextField
            label="New Admin Address"
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangeAdmin}
            disabled={isChanging || !newAdmin}
            sx={{ mt: 2 }}
          >
            {isChanging ? 'Changing...' : 'Transfer Admin Rights'}
          </Button>
        </Box>
      ) : (
        <Alert severity="info">
          Only the contract admin can perform administrative actions
        </Alert>
      )}
    </Box>
  );
};

export default AdminPanel;