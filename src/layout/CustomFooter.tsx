import { 
  Box, 
  Divider, 
  Typography, 
  Link, 
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";


const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const guessContractAddress = process.env.REACT_APP_GUESS_CONTRACT_ADDRESS;
  const erc20TokenRepresentingUsdStableCoinContractAddress =
    process.env.REACT_APP_ERC20_TOKEN_REPRESENTING_USD_STABLE_COIN_CONTRACT_ADDRESS;

  const explorerUrl = "https://sepolia.etherscan.io";

  return (
    <Box 
      component="footer"
      sx={{
        py: 3,
        px: 2,
        width: '100%',

        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.mode === 'light' 
          ? theme.palette.grey[200] 
          : theme.palette.grey[800],
        zIndex: theme.zIndex.appBar - 1,
      }}
    >
      <Divider sx={{ mb: 2 }} />
      
      <Stack 
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 1 : 4}
        justifyContent="center"
        alignItems="center"
        divider={
          <Divider 
            orientation={isMobile ? "horizontal" : "vertical"} 
            flexItem 
          />
        }
      >
        <Box textAlign="center">
          <Typography variant="subtitle2" gutterBottom>
            Guess Contract
          </Typography>
          <Link
            href={`${explorerUrl}/address/${guessContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isMobile ? 'View' : 'View Contract'} 

          </Link>
        </Box>

        <Box textAlign="center">
          <Typography variant="subtitle2" gutterBottom>
            USDT Contract
          </Typography>
          <Link
            href={`${explorerUrl}/address/${erc20TokenRepresentingUsdStableCoinContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isMobile ? 'View' : 'View Token'} 
      
          </Link>
        </Box>

        <Box textAlign="center">
          <Typography variant="subtitle2" gutterBottom>
            Block Explorer
          </Typography>
          <Link
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Sepolia Etherscan

          </Link>
        </Box>
      </Stack>

      <Divider sx={{ mt: 2 }} />
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ mt: 2 }}
      >
        © {new Date().getFullYear()} Guess Protocol. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;