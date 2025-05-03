import { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useAdmin } from 'contexts/AdminContext';
import { useBets } from 'contexts/BetsContext';


const CloseBetForm = () => {
  const { closeBet } = useAdmin();
  const [betId, setBetId] = useState('');
  const [outcome, setOutcome] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {fetchBets} = useBets();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await closeBet(
        BigInt(Number(betId)),
        BigInt(Number(outcome))
      );
    } finally {
      await fetchBets()
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>Close Bet</Typography>
      
      <TextField
        label="Bet Id"
        type="number"
        fullWidth
        margin="normal"
        value={betId}
        onChange={(e) => setBetId(e.target.value)}
      />
      
      <TextField
        label="Outcome"
        type="number"
        fullWidth
        margin="normal"
        value={outcome}
        onChange={(e) => setOutcome(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isSubmitting || !outcome || !betId}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Closing...' : 'Close Bet'}
      </Button>
    </Box>
  );
};

export default CloseBetForm;