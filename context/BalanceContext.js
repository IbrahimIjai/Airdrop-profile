import { useWeb3React } from "@web3-react/core";
import { utils } from "ethers";
import { createContext, useState, useEffect } from "react";
import { provider, WKCSInstance } from "../utils/utils";
export const BalanceContext = createContext();

export default function BalanceContextProvider({ children }) {
  const [KCS, setKCS] = useState(0);
  const [WKCS, setWKCS] = useState(0);
  const { account, active } = useWeb3React();
  useEffect(() => {
    async function fetchBalance() {
      if (active) {
        const KCSBalance = await provider.getBalance(account);
        setKCS(utils.formatEther(KCSBalance).substring(0, 7));
        const WKCSBalance = await WKCSInstance.balanceOf(account);
        setWKCS(utils.formatEther(WKCSBalance).substring(0, 7));
      }
    }
    fetchBalance();
  }, [account]);

  return (
    <BalanceContext.Provider value={{ KCS, WKCS, setKCS, setWKCS }}>
      {children}
    </BalanceContext.Provider>
  );
}
