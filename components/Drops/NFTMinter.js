import styles from "../styles/Minted.module.css";
import { useWeb3React } from "@web3-react/core";
import { SlInfo } from "react-icons/sl";
import { DataContext } from "../../pages/drops/[address]";
import { useContext, useEffect, useRef, useState } from "react";
import { Contract, utils } from "ethers";
import { contracts, DistantNFTsABI } from "../../constants/ABIs";
import Notification, { ACTIONS } from "../Notifications/Notification";
export default function MintedItems() {
  const { active, account, library } = useWeb3React();
  const inputRef = useRef(null);
  const [view, setView] = useState(false);
  const [state, setState] = useState(null);
  const [count, setCount] = useState(1);
  const { data, address } = useContext(DataContext);
  async function mint() {
    console.log("Start");
    try {
      const signer = library.getSigner();
      const contract = new Contract(contracts.MINTER, DistantNFTsABI, signer);
      const fee = utils.parseEther(data.mintFee);
      const tx = await contract.mint(account, count, { value: fee });
      await tx.wait();
    } catch (e) {
      setState({ type: ACTIONS.ERROR, payload: `${e.reason} - ${e.method}` });
      setView(true);
      console.log(e.reason, e.method);
    }
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      setView(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [view]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <>
      {view ? <Notification action={state} /> : null}
      <main className={styles.NFTMinter}>
        <div>NFT Minter</div>
        {!active ? (
          <div>Please connect your wallet to get started</div>
        ) : account != data.owner ? (
          <div>Ensure you do your do your due diligence before minting</div>
        ) : null}
        {!data.floor ? (
          <div>
            <SlInfo size={"0.7em"} />{" "}
            <span>
              Collection is not listed on the Distant Finance Marketplace
            </span>
          </div>
        ) : null}
        <div>
          You can mint a maximum of {data.maxMint} {data.name} per transaction
        </div>
        <div className={styles.notAddress}>
          {data.maxMint == 1 ? (
            <input
              type="number"
              placeholder="enter count of NFTs to mint"
              onChange={(e) => setCount(() => e.target.value)}
              ref={inputRef}
            />
          ) : null}
          <div onClick={mint}>Mint NFT</div>
        </div>
      </main>
    </>
  );
}
