// components/Bets/ClosedBetCard.tsx
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Chip 
  } from '@mui/material';
  import { formatDate } from '../../utils/formatters';
  import { Bet} from 'interfaces/GuessContractInterface';    

  import { tokenScaleDown } from '../../utils/formatters';
import { useERC20TokenRepresentingUSDT } from 'contexts/ERC20TokenRepresentingUSDTContext';

  interface ClosedBetCardProps {
    bet: Bet;
  }
  
  const ClosedBetCard = ({ bet }: ClosedBetCardProps) => {
    const {usdDecimals} = useERC20TokenRepresentingUSDT()
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
            Due: {formatDate(Number(bet.dueDate))}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Closing Time: {formatDate(Number(bet.dueDate-bet.maxSecondsBeforeDueForParticipation))}
          </Typography>
          
          <Box mt={2}>
            <Typography variant="body1">
              Base Stake: {tokenScaleDown(bet.baseStakeUnit.toString(),usdDecimals)} USDT
            </Typography>
            <Typography variant="body1">
              Total Pool: {tokenScaleDown(bet.collectedAmount.toString(),usdDecimals)} USDT
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