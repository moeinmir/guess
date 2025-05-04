import { useCallback, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import coinbase_Logo from "../assets/images/coinbase_Logo.png";
import metamask_Logo from "../assets/svg/metamask_Logo.svg";
import walletconnect_Logo from "../assets/svg/walletconnect_Logo.svg";
import { hooks as coinbaseWallethooks, coinbaseWallet } from "../connectors/coinbaseWallet";
import { getName } from "../connectors/getConnectorName";
import { hooks as metaMaskhooks, metaMask } from "../connectors/metaMask";
import { hooks as walletConnecthooks, walletConnect } from "../connectors/walletConnect";
import { getAddChainParameters } from "../networks/networks";

import ConnectButton from "./ConnectButton";

const styles = {
  modalTitle: {
    marginBottom: "20px",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px"
  }
} as const;

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const { useIsActivating: useMMIsActivating } = metaMaskhooks;
const { useIsActivating: useWCIsActivating } = walletConnecthooks;
const { useIsActivating: useCBIsActivating } = coinbaseWallethooks;

const ConnectModal: React.FC<ConnectModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isMMActivating = useMMIsActivating();
  const isWCActivating = useWCIsActivating();
  const isCBActivating = useCBIsActivating();
  
  const activateConnector = useCallback(async (label: string) => {
    try {
      const anyWC = walletConnect as any;
      try {
        const provider = await anyWC.provider;

        if (provider?.disconnect) {
          await provider.disconnect();
        }
      } catch (err) {
        console.warn("Error resetting WalletConnect session:", err);
      }
      switch (label) {
        case "MetaMask":
          // await metaMask.activate();
          await metaMask.activate(getAddChainParameters(11155111));
          window.localStorage.setItem("connectorId", getName(metaMask));
          break;

        case "WalletConnect":
          await walletConnect.activate();
          window.localStorage.setItem("connectorId", getName(walletConnect));
          break;

        case "Coinbase Wallet":
          await coinbaseWallet.activate();
          window.localStorage.setItem("connectorId", getName(coinbaseWallet));
          break;

        default:
          break;
      }
    } catch (error) {
      setErrorMsg("Failed to connect wallet. Please try again.");
      setSnackbarOpen(true);
    }
  }, []);

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            padding: "15px",
            fontSize: "17px",
            fontWeight: 500,
          },
        }}
        // sx={{ zIndex: -1 }}
      >
        <DialogContent>
          <div style={styles.modalTitle}>Connect Your Wallet</div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <ConnectButton
              label="MetaMask"
              image={metamask_Logo}
              onClick={() => activateConnector("MetaMask")}
              loading={isMMActivating}
            />
            <ConnectButton
              label="WalletConnect"
              image={walletconnect_Logo}
              onClick={() => activateConnector("WalletConnect")}
              loading={isWCActivating}
            />
            <ConnectButton
              label="Coinbase Wallet"
              image={coinbase_Logo}
              onClick={() => activateConnector("Coinbase Wallet")}
              loading={isCBActivating}
            />
            <Divider sx={{ marginTop: 2 }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectModal;
