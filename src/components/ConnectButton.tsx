import { FC } from "react";
import { 
  Button,
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ConnectButtonRoot = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  padding: "20px 16px",
  marginBottom: "12px",
  boxShadow: "0 4px 4px rgba(0,0,0,.25), 0 0 5px rgba(0,0,0,.25), inset 0 0 10px #fff",
  border: "none",
  borderRadius: "10px",
  textTransform: "none",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)"
  }
});

const ConnectButtonText = styled(Typography)({
  fontWeight: 600,
  paddingLeft: "30px"
});

interface ConnectButtonProps {
  label: string;
  image: string;
  onClick: () => void;
  loading: boolean;
}

const ConnectButton: FC<ConnectButtonProps> = ({ label, image, onClick, loading }) => {
  return (
    <ConnectButtonRoot
      variant="outlined"
      onClick={onClick}
      disabled={loading}
      fullWidth
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <ConnectButtonText variant="body1">
          {label}
        </ConnectButtonText>
      )}
      {!loading && (
        <Box component="img" 
          src={image} 
          width={32} 
          height={32} 
          alt="web3-wallet" 
        />
      )}
    </ConnectButtonRoot>
  );
};

export default ConnectButton;