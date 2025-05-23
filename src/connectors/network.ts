import { initializeConnector } from "@web3-react/core";
import { Network } from "@web3-react/network";

import { URLS } from "../networks/networks";

export const [network, hooks] = initializeConnector<Network>((actions) => new Network({ actions, urlMap: URLS }));
