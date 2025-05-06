import { Box, Typography, Tabs, Tab, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useBets } from "contexts/BetsContext";
import { useUser } from "contexts/UserContext";
import ActiveBetCard from "./ActiveBetCard";
import SettledBetCard from "./SettledBetCard";
import ClosedBetCard from "./ClosedBetCard";
import WinningBetCard from "./WinningBetCard";
import SettledWinningBetCard from "./SettledWinningBetCard";
import { Button } from "antd";
const BetsDashboard = () => {
  const {
    activeBets,
    closedBets,
    settledBets,
    winningBets,
    settledWinningBets,
    loading,
    settleBet,
    reversePageNumber,
    callSetReversePageNumber,
    isLastPage,
  } = useBets();
  const { isRegistered } = useUser();
  const [tabValue, setTabValue] = useState(0);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          disabled={reversePageNumber === 0}
          onClick={() =>
            callSetReversePageNumber(Number(reversePageNumber) - 1)
          }
        >
          Previous
        </Button>
        <Typography mx={2}>Page {reversePageNumber.toString()}</Typography>
        <Button
          onClick={() =>
            callSetReversePageNumber(Number(reversePageNumber) + 1)
          }
          disabled={isLastPage}
        >
          Next
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        Guess Away
      </Typography>
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label={`Active (${activeBets.length})`} />
        <Tab label={`Closed (${closedBets.length})`} />
        <Tab label={`Settled (${settledBets.length})`} />
        <Tab label={`Unsettled Winning (${winningBets.length})`} />
        <Tab label={`Settled Winning (${settledWinningBets.length})`} />
      </Tabs>
      <Box mt={2}>
        {tabValue === 0 && (
          <Box>
            {activeBets.length > 0 ? (
              activeBets.map((bet) => (
                <ActiveBetCard
                  key={bet.id.toString()}
                  bet={bet}
                  canBet={isRegistered}
                />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h5" color="text.secondary">
                  No Active Bets Available
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            {closedBets.length > 0 ? (
              closedBets.map((bet) => (
                <ClosedBetCard key={bet.id.toString()} bet={bet} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h5" color="text.secondary">
                  No Closed Bets Available
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {tabValue === 2 && (
          <Box>
            {settledBets.length > 0 ? (
              settledBets.map((bet) => (
                <SettledBetCard
                  key={bet.id.toString()}
                  bet={bet}
                  canClaim={isRegistered}
                />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h5" color="text.secondary">
                  No Settled Bets Yet
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {tabValue === 3 && (
          <Box>
            {winningBets.length > 0 ? (
              winningBets.map((bet) => (
                <WinningBetCard
                  key={bet.id.toString()}
                  bet={bet}
                  onSettle={settleBet}
                />
              ))
            ) : (
              <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h5" color="text.secondary">
                No Winning Bets Yet
              </Typography>
            </Box>
            )}
          </Box>
        )}
        {tabValue === 4 && (
          <Box>
            {settledWinningBets.length > 0 ? (
              settledWinningBets.map((bet) => (
                <SettledWinningBetCard key={bet.id.toString()} bet={bet} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h5" color="text.secondary">
                  No Settled Winning Bets Available
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default BetsDashboard;
