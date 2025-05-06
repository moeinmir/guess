import {
  Box,
  Typography,
  Link,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const guessContractAddress = process.env.REACT_APP_GUESS_CONTRACT_ADDRESS;
  const erc20TokenRepresentingUsdStableCoinContractAddress =
    process.env
      .REACT_APP_ERC20_TOKEN_REPRESENTING_USD_STABLE_COIN_CONTRACT_ADDRESS;
  const explorerUrl = "https://sepolia.etherscan.io";
  // const subdomain = process.env.REACT_APP_SUBDOMAIN || "";
  return (
    <Box
      component="footer"
      sx={{
        py: 0.2,
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        zIndex: theme.zIndex.appBar - 1,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 0.5 : 2}
        justifyContent="center"
        alignItems="center"
      >
        <Box textAlign="center">
          <Typography variant="caption" gutterBottom>
            Guess Contract
          </Typography>
          <Link
            href={`${explorerUrl}/address/${guessContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >
            {isMobile ? "View" : "View Contract"}
          </Link>
        </Box>

        <Box textAlign="center">
          <Typography variant="caption" gutterBottom>
            USDT Contract
          </Typography>
          <Link
            href={`${explorerUrl}/address/${erc20TokenRepresentingUsdStableCoinContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >
            {isMobile ? "View" : "View Token"}
          </Link>
        </Box>
        <Box textAlign="center">
          <Typography variant="caption" gutterBottom>
            Block Explorer
          </Typography>
          <Link
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >
            Sepolia Etherscan
          </Link>
        </Box>

        <Box textAlign="center">
        <Typography variant="caption" gutterBottom>
          Documentation
        </Typography>
        <Link
          href={"guess/docs.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
          }}
        >
          docs
        </Link>
      </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ mt: 1 }}
        >
          © {new Date().getFullYear()} Guess Protocol
        </Typography>
      </Stack>

    </Box>
  );
};

export default Footer;
