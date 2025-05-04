
import { useWeb3React } from "@web3-react/core";
import { useUser } from "contexts/UserContext";
import LandingPage from "pages/LandingPage";
import { Box,Typography } from "@mui/material";
const MainLayout: React.FC = () =>{
    
    const {account} = useWeb3React()
    const {isRegistered} = useUser()
    if (!account) {
        return (
          <Box
            sx={{
 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
  
            }}
          >
            <Typography variant="h5" color="text.secondary">
              Connect Your Wallet
            </Typography>
          </Box>
        );
      }
      
      if (!isRegistered) {
        return (
          <Box
            sx={{
                display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',

            }}
          >
            <Typography variant="h5" color="text.secondary">
              Register
            </Typography>
          </Box>
        );
      }
      else{
      return <LandingPage/>
    }
    
}

export default MainLayout;

