import { useWeb3React } from "@web3-react/core";
import { useContext, useEffect, useState } from "react";
import { connectors } from "./connectors";
import styles from "../styles/Connect.module.css";
import { AnimatePresence } from "framer-motion";
// import { BalanceContext } from "../context/BalanceContext";
import ConnectModal from "../components/modals/WalletModal/Connect"
import DisconnectModal from "../components/modals/WalletModal/Disconnect";
import Blockie from "../utils/Blockies";
export default function Connect() {
  const { active, account, chainId, activate, deactivate } = useWeb3React();
  const [showNotification, setShowNotification] = useState(false);

  // const { KCS, WKCS } = useContext(BalanceContext);

  async function inChain() {
    if (!window.ethereum) {
      alert(
        "Metamask is not installed on your Browser. Install via https://metamask.io/download"
      );
      return false;
    }
    if (chainId === "0x141") {
      return true;
    }
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x141" }],
      });
      return true;
    } catch (switchError) {
      if (
        switchError.code === 4902 ||
        switchError.data?.originalError?.code === 4902
      ) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x141",
                chainName: "KCC-MAINNET",
                rpcUrls: ["https://rpc-mainnet.kcc.network"],
                nativeCurrency: {
                  name: "KCS Token",
                  symbol: "KCS",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.kcc.io/en"],
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.error(switchError);
      }
    }
    return false;
  }

  const connect = async () => {
    try {
      await activate(connectors.injected);
      await inChain();
      window.localStorage.setItem("isWalletConnected", true);
      setConnectModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const connectWC = async () => {
    try {
      await activate(connectors.walletConnect);
      window.localStorage.setItem("isWalletConnected", true);
      setConnectModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = async () => {
    try {
      deactivate(connectors.injected);
      window.localStorage.setItem("isWalletConnected", false);
      setDisconnectModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(connectors.injected);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  const [connectModal, setConnectModal] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(account);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className={styles.container}>
      {active ? (
        <div
          className={styles.disconnect}
          onClick={() => setDisconnectModal(true)}
          style={{ display: "flex", gap: 5 }}
        >
          <Blockie address={account} size={10} />
        </div>
      ) : (
        <div className={styles.connect} onClick={() => setConnectModal(true)}>
          Connect
        </div>
      )}
      <AnimatePresence>
        {connectModal && (
          <ConnectModal
            setConnectOpen={setConnectModal}
            connect={connect}
            connectWC={connectWC}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {disconnectModal && (
          <DisconnectModal
            account={account}
            setDisconnectOpen={setDisconnectModal}
            disconnect={disconnect}
            KCS={KCS}
            WKCS={WKCS}
            copy={copy}
            showNotification={showNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
