import React, { CSSProperties, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { 
  Box,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
  styled
} from "@mui/material";
import { getEllipsisTxt } from "../utils/formatters";
import Jazzicons from "./Jazzicons";

const AddressBox = styled(Box)(({ theme }) => ({
  height: "36px",
  display: "flex",
  gap: "5px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "10px",
  alignItems: "center",
  justifyContent: "space-around",
  padding: theme.spacing(0, 1)
}));

const AddressContent = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  gap: "1rem"
});

export interface AddressProps {
  style?: CSSProperties;
  avatar: string;
  size?: number;
  copyable: boolean;
}

const CopyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Address: React.FC<AddressProps> = (props) => {
  const { account } = useWeb3React();
  const [address, setAddress] = useState<string>();
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    if (account !== undefined) setAddress(account);
  }, [account]);

  useEffect(() => {
    const timer = isClicked
      ? setTimeout(() => setIsClicked(false), 5000)
      : null;
  
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isClicked]);
  

  if (address === undefined) {
    return (
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={36} 
        sx={{ borderRadius: '10px' }} 
      />
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setIsClicked(true);
  };

  return (
    <AddressBox style={props.style}>
      <AddressContent>
        {props.avatar === "left" && <Jazzicons seed={address} />}
        <Typography variant="body1">
          {props.size ? getEllipsisTxt(address, props.size) : address}
        </Typography>
      </AddressContent>
      {props.avatar === "right" && <Jazzicons seed={address} />}
      {props.copyable && (
        <Tooltip 
          title={isClicked ? "Copied!" : "Copy Address"} 
          placement="top"
          arrow
        >
          <IconButton 
            onClick={handleCopy} 
            size="small"
            color={isClicked ? "success" : "primary"}
          >
            {isClicked ? <CheckIcon /> : <CopyIcon />}
          </IconButton>
        </Tooltip>
      )}
    </AddressBox>
  );
};

export default Address;