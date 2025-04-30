import { Skeleton } from "@mui/material";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

/**
 * Shows a Jazzicon for the provided wallet address
 * @param {*} props
 * @returns <Jazzicons /> JSX Element
 */

const Jazzicons = ({ seed, size }: { seed: string; size?: number }) => {
  if (!seed) return <Skeleton variant="circular" width={size ?? 40} height={size ?? 40} />;

  return <Jazzicon seed={jsNumberForAddress(seed)} diameter={size ?? 40} />;
};
export default Jazzicons;
