// components/Bets/ClosedBetCard.tsx
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Chip 
  } from '@mui/material';
  import { formatDate, formatUSDTToken } from '../utils/formatters';
  import { Bet} from 'interfaces/GuessContractInterface';    

  interface ClosedBetCardProps {
    bet: Bet;
  }
  
  const ClosedBetCard = ({ bet }: ClosedBetCardProps) => {
    return (
      <Card sx={{ mb: 2, backgroundColor: '#f5f5f5' }}>
        <CardContent>

        <Typography variant="body2" color="text.secondary" mt={1}>

          Bet Id: {(bet.id).toString()}
         
          </Typography>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">{bet.description}</Typography>
            <Chip label="Closed" color="secondary" />
          </Box>
          
          <Typography variant="body2" color="text.secondary" mt={1}>
            Closed on: {formatDate(Number(bet.dueDate))}
          </Typography>
          
          <Box mt={2}>
            <Typography variant="body1">
              Base Stake: {formatUSDTToken(bet.baseStakeUnit)} USDT
            </Typography>
            <Typography variant="body1">
              Total Pool: {formatUSDTToken(bet.collectedAmount)} USDT
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Awaiting settlement...
            </Typography>
          </Box>
  
          {/* Admin-only settlement UI would go here */}
        </CardContent>
      </Card>
    );
  };
  
  export default ClosedBetCard;