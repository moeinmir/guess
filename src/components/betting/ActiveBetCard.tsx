import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Alert,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useBets } from "contexts/BetsContext";
import { useERC20TokenRepresentingUSDT } from "contexts/ERC20TokenRepresentingUSDTContext";
import { formatDate } from "../../utils/formatters";
import { tokenScaleDown } from "../../utils/formatters";

import { Bet } from "../../interfaces/GuessContractInterface";

interface ActiveBetCardProps {
  bet: Bet;
  canBet: boolean | null;
}

const ActiveBetCard = ({ bet, canBet }: ActiveBetCardProps) => {
  const [guess, setGuess] = useState("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { placeBet } = useBets();
  const { allowance, refresh, approveToken, usdDecimals } = useERC20TokenRepresentingUSDT();

  useEffect(() => {
    if ( canBet && Number(bet.baseStakeUnit) > Number(allowance)) {
      setNeedsApproval(true);
    } else {
      setNeedsApproval(false);
    }
  }, [allowance, bet.baseStakeUnit, canBet]);

  const handleBet = async () => {
    if (!guess) return;
    setIsPlacingBet(true);
    try {
      await placeBet(bet.id, BigInt(guess));
      setGuess("");
      await refresh();
    } finally {
      setIsPlacingBet(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const approveAmount = bet.baseStakeUnit;
      await approveToken(approveAmount);
      setNeedsApproval(false);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>

      <CardContent>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Bet Id: {bet.id.toString()}
        </Typography>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{bet.description}</Typography>
          <Chip label="Active" color="primary" />
        </Box>

        <Typography variant="body2" color="text.secondary" mt={1}>
          Due: {formatDate(Number(bet.dueDate))}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          Closing Time:{" "}
          {formatDate(
            Number(bet.dueDate - bet.maxSecondsBeforeDueForParticipation)
          )}
        </Typography>

        <Typography variant="body1" mt={2}>
          Required Stake: {tokenScaleDown(bet.baseStakeUnit.toString(),usdDecimals)} TOKEN
        </Typography>

        {needsApproval && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Stack direction="column" spacing={1}>
              <div>You need to approve the contract to spend your tokens</div>
              <Button
                variant="contained"
                color="warning"
                onClick={handleApprove}
                disabled={isApproving}
                size="small"
              >
                {isApproving ? "Approving..." : "Approve Tokens"}
              </Button>
            </Stack>
          </Alert>
        )}

        {canBet && !needsApproval && (
          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <TextField
              label="Your Guess"
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleBet}
              disabled={isPlacingBet || !guess}
            >
              {isPlacingBet ? "Placing..." : "Place Bet"}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
export default ActiveBetCard;
