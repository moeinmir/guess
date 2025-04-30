import { FC, JSX, useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
} from "@mui/material";
import { chainData } from "../networks/chainData";
import { useSwitchChain } from "../hooks/useSwitchChain";
import { useWindowSize } from "../hooks/useWindowSize";

const createLabel = (logo: string, alt: string, label?: string) => (
  <Box display="flex" alignItems="center">
    <img
      src={logo}
      alt={alt}
      style={{
        width: 25,
        height: 25,
        borderRadius: 10,
        marginRight: label ? 8 : 0,
      }}
    />
    {label && <Typography ml={1}>{label}</Typography>}
  </Box>
);

const ChainSelector: FC = () => {
  const switchChain = useSwitchChain();
  const { chainId, isActive } = useWeb3React();
  const { isTablet } = useWindowSize();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<{
    id: string | null;
    label: JSX.Element | null;
  }>({ id: null, label: null });

  const open = Boolean(anchorEl);

  const handleChainChange = useCallback(
    (chainId: string) => {
      const chain = chainData.find((chain) => chain.id === chainId);
      const selectedLabel = chain
        ? createLabel(
            chain.logo,
            `${chain.label}_logo`,
            isTablet ? undefined : chain.label
          )
        : null;
      setSelected({ id: chainId, label: selectedLabel });
    },
    [isTablet]
  );

  useEffect(() => {
    if (chainId) {
      handleChainChange(chainId.toString());
    }
  }, [chainId, handleChainChange]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (key: string) => {
    try {
      await switchChain(Number(key));
      handleClose();
    } catch (error) {
      console.error(`Failed to switch chains: ${error}`);
    }
  };



  if (!chainId || !isActive)
    return (
      <></>
    );

  return (
    <div>
      <Button
        id="chain-selector-button"
        aria-controls={open ? "chain-selector-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {!selected.id ? (
          <Typography component="span">Select Chain</Typography>
        ) : (
          selected.label
        )}
      </Button>
      <Menu
        id="chain-selector-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {chainData.map((chain) => (
          <MenuItem
            key={chain.id}
            onClick={() => handleMenuItemClick(chain.id)}
            selected={selected.id === chain.id}
          >
            <ListItemIcon>
              <img
                src={chain.logo}
                alt={`${chain.label}_logo`}
                style={{ width: 25, height: 25, borderRadius: 10 }}
              />
            </ListItemIcon>
            <Typography variant="inherit">{chain.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ChainSelector;
