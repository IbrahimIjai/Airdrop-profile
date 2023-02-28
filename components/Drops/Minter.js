import { useState } from "react";
import { MinterABI, contracts } from "../../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
import styles from "../styles/Minter.module.css";
import { Contract } from "ethers";
import Notification, { ACTIONS } from "../Notifications/Notification";

export default function Minter() {
  const { library } = useWeb3React();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [uri, setUri] = useState("");
  const [supply, setSupply] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [triggerMsg, setTriggerMsg] = useState(null);
  const elements = [
    {
      type: "text",
      placeholder: "name",
      tooltip: "collection name",
      change: (e) => setName(() => e.target.value),
    },
    {
      type: "text",
      placeholder: "symbol",
      tooltip: "symbol: minimum of 3 characters",
      pattern: ".{3,}",
      change: (e) => setSymbol(() => e.target.value),
    },
    {
      type: "text",
      placeholder: "URI",
      tooltip: "collection metadata URI",
      change: (e) => setUri(() => e.target.value),
    },
    {
      type: "number",
      placeholder: "max supply",
      tooltip: "NFTs maximum supply",
      change: (e) => setSupply(() => e.target.value),
    },
  ];
  const submit = async (e) => {
    try {
      e.preventDefault();
      const NAME = name[0].toUpperCase() + name.slice(1);
      if (symbol.length < 3) throw new Error();
      const SYMBOL = symbol.toUpperCase();
      const URI = uri[uri.length - 1] !== "/" ? uri + "/" : uri;
      const signer = library.getSigner();
      const contract = new Contract(contracts.MINTER, MinterABI, signer);
      const tx = await contract.createContract(NAME, SYMBOL, URI, supply);
      await tx.wait();
      if (tx.hash) setTrigger(true);
      setTriggerMsg({ type: ACTIONS.TXN, payload: tx.hash });
      setName("");
      setSymbol("");
      setUri("");
      setSupply("");
    } catch (e) {
      console.log(e);
      setTrigger(true);
      setTriggerMsg({ type: ACTIONS.ERROR });
    }
  };
  return (
    <div className={styles.minterBox}>
      {trigger ? <Notification action={triggerMsg} /> : null}
      {/* <p>Minting fee is 5KCS</p> */}
      <div
        className={styles.header}
        style={{ marginTop: 0, paddingTop: "20px" }}
      >
        <h2 className={styles.headerTitle}>Mint your Collection</h2>
        <p style={{ opacity: 0.9 }}>
          Build scalable NFT projects and connect with Collectors and a
          Community. Mint your creation as a collection with full royalty rights
          and controls. Whitelist mint, launch, and verify your collection to
          the Distant marketplace to sell on the open market.
        </p>
      </div>
      <div className={styles.input}>
        {elements.map((input, i) => (
          <span key={i}>
            <input
              type={input.type}
              autoComplete="off"
              required=""
              placeholder={input.tooltip}
              onChange={input.change}
            />
          </span>
        ))}
      </div>
      <div className={styles.createCollection} onClick={submit}>
        Create Collection
      </div>
    </div>
  );
}
