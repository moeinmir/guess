// components/Admin/AddBetForm.tsx
import { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useAdmin } from "contexts/AdminContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from "dayjs";
import { useBets } from "contexts/BetsContext";
import { useERC20TokenRepresentingUSDT } from "contexts/ERC20TokenRepresentingUSDTContext";
import { tokenScaleUp } from "utils/formatters";

const AddBetForm = () => {
  const { addBet } = useAdmin();
  const {usdDecimals} = useERC20TokenRepresentingUSDT();
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [baseStake, setBaseStake] = useState("");
  const [
    maxSecondsBeforeDueForParticipation,
    setMaxSecondsBeforeDueForParticipation,
  ] = useState("");
  const [feePercentage, setFeePercentage] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchBets } = useBets();

  const handleSubmit = async () => {
    if (!dueDate) return;
    // const SECONDS_IN_MINUTES = 60
    // const dueDateInSeconds = dueDate.unix() + dueDate.utcOffset()*SECONDS_IN_MINUTES;
    const dueDateInSeconds = dueDate.unix()
    setIsSubmitting(true);
    try {
      const baseStakeScaledUp = tokenScaleUp(baseStake,usdDecimals)
      await addBet(
        BigInt(dueDateInSeconds),
        description,
        BigInt(baseStakeScaledUp),
        Number(feePercentage),
        BigInt(Number(maxSecondsBeforeDueForParticipation))
      );
    } finally {
      await fetchBets();
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Add New Bet
      </Typography>

      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateTimePicker"]}>
          <DateTimePicker
            value={dueDate}
            onChange={(e) => setDueDate(e)}
            label="Due Date"
       
          />
        </DemoContainer>
      </LocalizationProvider>

      <TextField
        label="Base Stake (Tokens)"
        type="number"
        fullWidth
        margin="normal"
        value={baseStake}
        onChange={(e) => setBaseStake(e.target.value)}
      />

      <TextField
        label="Max Seconds Before Due To Participate"
        type="number"
        fullWidth
        margin="normal"
        value={maxSecondsBeforeDueForParticipation}
        onChange={(e) => setMaxSecondsBeforeDueForParticipation(e.target.value)}
      />

      <TextField
        label="Fee Percentage"
        type="number"
        fullWidth
        margin="normal"
        value={feePercentage}
        onChange={(e) => setFeePercentage(e.target.value)}
        InputProps={{ endAdornment: "%" }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isSubmitting || !description || !baseStake}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? "Creating..." : "Create Bet"}
      </Button>
    </Box>
  );
};

export default AddBetForm;
