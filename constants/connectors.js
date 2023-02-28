import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { rpc as rpcUrl } from "../utils/utils";

const injected = new InjectedConnector({
  supportedChainIds: [321],
});

const walletconnect = new WalletConnectConnector({
  rpc: {
    321: rpcUrl,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
};
