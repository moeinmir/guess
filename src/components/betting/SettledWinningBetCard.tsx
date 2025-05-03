import { 
    Card, 
    CardContent, 
    Typography, 

    Box, 
    Chip 
  } from '@mui/material';

  import { formatDate, formatUSDTToken} from '../../utils/formatters';
  import { Bet } from 'interfaces/GuessContractInterface';

  interface SettledWinningBetCardProps {
    bet: Bet;
  }
  
  const SettledWinningBetCard = ({ bet }: SettledWinningBetCardProps) => {
  
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>


        <Typography variant="body2" color="text.secondary" mt={1}>

Bet Id: {(bet.id).toString()}

</Typography>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">{bet.description}</Typography>
            <Chip label="Settled" color="success" />
          </Box>
          
          <Typography variant="body2" color="text.secondary" mt={1}>
            Settled on: {formatDate(Number(bet.dueDate))}
          </Typography>
          
          <Typography variant="body1" mt={1}>
            Outcome: {bet.outcome.toString()}
          </Typography>
          

          
          <Typography variant="body1">
            Total Amount: {formatUSDTToken(bet.collectedAmount)} USDT
          </Typography>
          <Typography variant="body1">
            Winning Amount: {formatUSDTToken(bet.winingAmount)} USDT
          </Typography>


        </CardContent>
      </Card>
    );
  };
  
  export default SettledWinningBetCard;