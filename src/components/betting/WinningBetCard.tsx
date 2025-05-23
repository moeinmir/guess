import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { formatDate } from "../../utils/formatters";
import { Bet } from "interfaces/GuessContractInterface";
import { useState } from "react";
import { tokenScaleDown } from "../../utils/formatters";
import { useERC20TokenRepresentingUSDT } from "contexts/ERC20TokenRepresentingUSDTContext";

interface WinningBetCardProps {
  bet: Bet;
  onSettle: (betId: bigint) => Promise<void>;
}

const WinningBetCard = ({ bet, onSettle }: WinningBetCardProps) => {
  const [isSettling, setIsSettling] = useState(false);
  const { usdDecimals } = useERC20TokenRepresentingUSDT();

  const handleSettle = async () => {
    setIsSettling(true);
    try {
      await onSettle(bet.id);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: "#edf7ed" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Bet Id: {bet.id.toString()}
        </Typography>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{bet.description}</Typography>
          <Chip label="You Won!" color="success" />
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

        <Stack spacing={1} mt={2}>
          <Typography>
            Your Reward: {tokenScaleDown(bet.winingAmount.toString(), usdDecimals)} USDT
          </Typography>
          <Typography>
            Total Pool: {tokenScaleDown(bet.collectedAmount.toString(), usdDecimals)} USDT
          </Typography>

          <Box mt={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSettle}
              disabled={isSettling}
              fullWidth
            >
              {isSettling ? "Claiming..." : "Claim Reward"}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WinningBetCard;
