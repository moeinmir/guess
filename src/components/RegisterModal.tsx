import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useUser } from "contexts/UserContext";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  CircularProgress 
} from "@mui/material";

import useContractWithABI from "hooks/useContractWithABIAndAddress";
import GuessABI from "../abis/GuessABI.json";
import { GuessContractInterface } from "interfaces/GuessContractInterface";

const RegisterModal: React.FC = () => {
  const { account } = useWeb3React();
  const { 
    userInfo, 
    isRegistered, 
    loading, 
    refreshUserData 
  } = useUser();

  const guessContract = useContractWithABI<GuessContractInterface>(
    process.env.REACT_APP_GUESS_CONTRACT_ADDRESS,
    GuessABI
  );
  
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [registering, setRegistering] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRegister = async () => {
    if (!userName.trim() || !guessContract) return;
    setRegistering(true);
    try {
      const tx = await guessContract.register(userName);
      await tx.wait();
      await refreshUserData();
      handleClose();
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (isRegistered && userInfo) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Welcome, {userInfo.userName}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Button 
        variant="contained" 
        onClick={handleOpen}
        disabled={!account}
      >
        {account ? "Register" : "Connect Wallet First"}
      </Button>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Register New Account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            You'll receive a registration bonus after successful signup.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleRegister} 
            disabled={!userName.trim() || registering}
          >
            {registering ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterModal;