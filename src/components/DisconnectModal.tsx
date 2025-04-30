import { useWeb3React } from "@web3-react/core";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,

} from "@mui/material";
import { getExplorer } from "../networks/networks";
import Address from "./Address";

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  disconnect: () => Promise<void>;
}

const ExternalLinkIcon = () => (
  <svg
    style={{ marginRight: "5px", verticalAlign: "middle" }}
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    viewBox="0 0 512 512"
    fill="currentColor"
  >
    <path d="M432 320h-32a16 16 0 0 0-16 16v112H64V128h112a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H48a48 48 0 0 0-48 48v320a48 48 0 0 0 48 48h320a48 48 0 0 0 48-48V336a16 16 0 0 0-16-16zm56-320H320a32 32 0 0 0-32 32v32a16 16 0 0 0 16 16h65.37L201.37 248.63a16 16 0 0 0 0 22.63l22.63 22.63a16 16 0 0 0 22.63 0L416 113.37V179a16 16 0 0 0 16 16h32a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32z" />
  </svg>
);

const DisconnectModal: React.FC<ConnectModalProps> = ({ isModalOpen, setIsModalOpen, disconnect }) => {
  const { account, chainId } = useWeb3React();

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Account</DialogTitle>
      <DialogContent sx={{ fontSize: "17px", fontWeight: 500 }}>
        <Card
          sx={{
            mt: 1,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ py: 2 }}>
            <Address avatar="left" size={6} copyable style={{ fontSize: "20px" }} />
            <div style={{ marginTop: "10px", padding: "0 10px" }}>
              {chainId !== undefined && (
                <a
                  href={`${getExplorer(chainId)}/address/${account}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", color: "#1976d2", textDecoration: "none" }}
                >
                  <ExternalLinkIcon />
                  View on Explorer
                </a>
              )}
            </div>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            borderRadius: 2,
            fontSize: "16px",
            fontWeight: 500,
          }}
          onClick={() => disconnect()}
        >
          Disconnect Wallet
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DisconnectModal;
