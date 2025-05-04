import { useAdmin } from "contexts/AdminContext";
import {
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { getNativeChainDecimals } from "networks/networks";
import { tokenScaleDown, tokenScaleUp } from "utils/formatters";
import { useERC20TokenRepresentingUSDT } from "contexts/ERC20TokenRepresentingUSDTContext";
const ContractBalanceManagement = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uSDCashOutAmount, setUSDCashOutAmount] = useState("");
  const [ethCashOutAmount, setEthCashOutAmount] = useState("");
  const {
    contractETHBalance,
    contractUSDBalance,
    cashOutETH,
    cashOutUSD,
    isOwner,
  } = useAdmin();
  const {usdDecimals} = useERC20TokenRepresentingUSDT()
  const {chainId} = useWeb3React()
  const nativeDecimals: number = getNativeChainDecimals(chainId!);
  const handleCashOutETH = async () => {
    if (!ethCashOutAmount) return;
    const ethCashOutAmountScaledUp = tokenScaleUp(ethCashOutAmount,nativeDecimals)
    setIsSubmitting(true);
    try {
      await cashOutETH(BigInt(ethCashOutAmountScaledUp));
      setEthCashOutAmount("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashOutUSD = async () => {
    if (!uSDCashOutAmount) return;
    const uSDCashOutAmountScaledUp = tokenScaleUp(uSDCashOutAmount,usdDecimals)
    setIsSubmitting(true);
    try {
      await cashOutUSD(BigInt(uSDCashOutAmountScaledUp));
      setUSDCashOutAmount("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h6">Contract Balances</Typography>
          <Typography>ETH: {tokenScaleDown(contractETHBalance?.toString()!,nativeDecimals)}</Typography>
          <Typography>USD: {tokenScaleDown(contractUSDBalance?.toString()!,usdDecimals)}</Typography>

        </Stack>
      </Paper>
      {isOwner && (
        <Box sx={{ maxWidth: 500, mx: "auto" }}>
          <Typography variant="h6" gutterBottom>
            ETH cash out
          </Typography>

          <TextField
            label="Eth CashOut Amount"
            type="number"
            fullWidth
            margin="normal"
            value={ethCashOutAmount}
            onChange={(e) => setEthCashOutAmount(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleCashOutETH}
            disabled={isSubmitting || !ethCashOutAmount}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? "Cashing out eth..." : "Cash out eth"}
          </Button>
        </Box>
      )}{" "}
      {isOwner && (
        <Box sx={{ maxWidth: 500, mx: "auto" }}>
          <Typography variant="h6" gutterBottom>
            USD cash out
          </Typography>

          <TextField
            label="USD CashOut Amount"
            type="number"
            fullWidth
            margin="normal"
            value={uSDCashOutAmount}
            onChange={(e) => setUSDCashOutAmount(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleCashOutUSD}
            disabled={isSubmitting || !uSDCashOutAmount}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? "Cashing out usd..." : "Cash out usd"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ContractBalanceManagement;
