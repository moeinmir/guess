import { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useAdmin } from "contexts/AdminContext";

const SettingForm = () => {
  const { changeAdmin , changeFeeReceiverAddress} = useAdmin();
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [newFeeReceiverAddress, setNewFeeReceiverAddress] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeAdmin = async () => {
    setIsSubmitting(true);
    try {
      await changeAdmin(newAdminAddress);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeFeeReceiverAddress = async () =>{

    setIsSubmitting(true)
    try{
        await changeFeeReceiverAddress(newFeeReceiverAddress)
    }
    finally{
        setIsSubmitting(false)
    }
  }
  
  return (
    <>
      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Change Admin
        </Typography>

        <TextField
          label="New Admin Address"
          fullWidth
          margin="normal"
          value={newAdminAddress}
          onChange={(e) => setNewAdminAddress(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleChangeAdmin}
          disabled={isSubmitting || !newAdminAddress}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Submitting..." : "Change admin address"}
        </Button>
      </Box>

      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Change Fee Receiver Address
        </Typography>

        <TextField
          label="New Fee Receiver Address"
          fullWidth
          margin="normal"
          value={newFeeReceiverAddress}
          onChange={(e) => setNewFeeReceiverAddress(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleChangeFeeReceiverAddress}
          disabled={isSubmitting || !newFeeReceiverAddress}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Submitting..." : "Change fee receiver address"}
        </Button>
      </Box>
    </>
  );
};
export default SettingForm;
