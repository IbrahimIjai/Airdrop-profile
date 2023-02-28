import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useContext } from "react";
import { createAuction, FUNCTIONS, list } from "../../NFTID/Functions";
import { utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import styles from "./Listing.module.css";
import { modal_backdrop, _modal } from "../../../utils/framermotion/NFTID";
import { PUT, server } from "../../../utils/utils";
import { NFTContext } from "../../../pages/collection/[collection]/[nftId]";
import { ACTIONS } from "../../Notifications/Notification";
export default function ListingModal() {
  const {
    ipfsData,
    collection,
    nftId,
    currentAccount,
    setModal,
    setLoading,
    closeTxn,
  } = useContext(NFTContext);
  const { library } = useWeb3React();
  let days = [7, 14, 30, 60, 90];
  const [value, setValue] = useState(null);
  const [saleType, setSaleType] = useState(true);
  const [validity, setValidity] = useState(days[0]);

  async function listToken() {
    if (value === null || value < 0) {
      closeTxn(ACTIONS.MESSAGE, "Value cannot be less than 0");
      setModal(false);
    }
    const signer = await library.getSigner();
    let _value = utils.parseEther(value);
    let txn;
    setLoading(true);
    if (saleType) {
      let dataBody = { seller: currentAccount, salePrice: value };
      txn = await list(signer, _value, collection, nftId);
      let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.SELL}`;
      if (txn) {
        await PUT(url, dataBody);
        closeTxn(ACTIONS.TXN, txn);
      } else closeTxn(ACTIONS.ERROR);
    } else {
      let dataBody = {
        seller: currentAccount,
        startingBid: value,
        validity: days[validity],
      };
      txn = await createAuction(
        signer,
        collection,
        nftId,
        _value,
        days[validity]
      );
      let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.CREATEAUCTION}`;
      if (txn) {
        await PUT(url, dataBody);
        closeTxn(ACTIONS.TXN, txn);
      } else closeTxn(ACTIONS.ERROR);
    }
    setModal(false);
  }

  const ref = useRef();
  useEffect(() => {
    const clickOut = (e) => {
      if (!ref?.current?.contains(e.target)) {
        setModal(false);
      }
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  });
  return (
    <motion.div
      variants={modal_backdrop}
      initial="init"
      animate="final"
      exit="exit"
      className={styles.modal}
    >
      <motion.div ref={ref} variants={_modal} className={styles.actualModal}>
        <div>List Token</div>
        <aside className={styles.TokenDetails}>
          <Image
            src={ipfsData.image}
            alt={ipfsData.name}
            width="100px"
            height="100px"
            className={styles.image}
          />
          <div className={styles.name}>
            <h3>{ipfsData.collectionName}</h3>
            <p>{ipfsData.name}</p>
          </div>
        </aside>
        <aside className={styles.selectorHeader}>
          <span>Sale Type</span>
          <div className={styles.selectors}>
            <div
              onClick={() => setSaleType(true)}
              className={
                saleType ? styles.divSelectorActive : styles.divSelector
              }
            >
              Fixed Sale
            </div>
            <div
              onClick={() => setSaleType(false)}
              className={
                !saleType ? styles.divSelectorActive : styles.divSelector
              }
            >
              Auction Sale
            </div>
          </div>
        </aside>
        <hr />
        <aside className={styles.inputBarContainer}>
          <div className={styles.inputBar}>
            <label htmlFor="sale">Sale Price</label>
            <input
              type="text"
              id="sale"
              onChange={(e) => setValue(() => e.target.value)}
              autoComplete="off"
              required=""
              className={styles.input}
              placeholder={saleType ? "Enter sale price" : "Enter opening bid"}
            />
            <span className={styles.asset}>KCS</span>
            {/* <p>
              Floor <span>2KCS</span> ($8.79)
            </p> */}
          </div>
          {!saleType && (
            <div className={styles.inputBar}>
              <label htmlFor="valid">Duration in Days</label>
              <div id="valid" className={styles.valid}>
                {days.map((day, i) => (
                  <span
                    key={i}
                    onClick={() => setValidity(i)}
                    className={`${styles.DaysSelector}  ${
                      validity == i ? styles.activeButton : ""
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
        <hr />
        <aside className={styles.ExecuteTx}>
          <div className={styles.cta} onClick={listToken}>
            List NFT
          </div>
        </aside>
      </motion.div>
    </motion.div>
  );
}
