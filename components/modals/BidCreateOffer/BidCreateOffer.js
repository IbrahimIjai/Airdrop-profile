import styles from "../UpdateModal/UpdateModal.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useContext } from "react";
import {
  bidInKCS,
  bidInWKCS,
  createOfferKCS,
  createOfferWKCS,
  FUNCTIONS,
} from "../../NFTID/Functions";
import PaymentMethodKCS from "../../Components/PaymentMethods/PaymentMethodKCS";
import PaymentMethodWKCS from "../../Components/PaymentMethods/PaymentMethodWKCS";
import { utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { modal_backdrop, _modal } from "../../../utils/framermotion/NFTID";
import { num } from "../../../utils/utils";
import { NFTContext } from "../../../pages/collection/[collection]/[nftId]";
import { ACTIONS } from "../../Notifications/Notification";
import { BalanceContext } from "../../../context/BalanceContext";
export default function BidCreateOfferModal() {
  const {
    saleInfo,
    collection,
    nftId,
    setBidOfferModal,
    setLoading,
    closeTxn,
    tokenInfo,
    bidOfferModalType,
  } = useContext(NFTContext);
  const { KCS: KCSBal, WKCS } = useContext(BalanceContext);
  const { library } = useWeb3React();
  const [value, setValue] = useState(0);
  const [select, setSelect] = useState(1);
  const [validity, setValidity] = useState(0);
  let days = [7, 14, 30, 60, 90];
  const { highestBid, startingBid, salePrice } = saleInfo;
  const { image, name } = tokenInfo;

  const isOfferCreate = bidOfferModalType === FUNCTIONS.CREATEOFFER;
  async function execute() {
    if (value < 0) {
      closeTxn(ACTIONS.MESSAGE, "Value cannot be less than 0");
      setBidOfferModal(false);
    }
    const signer = await library.getSigner();
    let _value = utils.parseEther(value);
    let txn;
    setLoading(true);
    if (isOfferCreate) {
      select === 1
        ? (txn = await createOfferKCS(
            signer,
            _value,
            collection,
            nftId,
            days[validity]
          ))
        : (txn = await createOfferWKCS(
            signer,
            _value,
            collection,
            nftId,
            days[validity]
          ));
    } else {
      if (value <= num(highestBid) || value <= num(startingBid)) {
        closeTxn(
          ACTIONS.MESSAGE,
          "Value cannot be less than or equal to StartingBid or HighestBid"
        );
        setBidOfferModal(false);
      }
      select === 1
        ? (txn = await bidInKCS(signer, collection, nftId, _value))
        : (txn = await bidInWKCS(signer, _value, collection, nftId));
    }
    txn ? closeTxn(ACTIONS.TXN, txn) : closeTxn(ACTIONS.ERROR);
    setBidOfferModal(false);
  }

  const ref = useRef();
  useEffect(() => {
    const clickOut = (e) => {
      if (!ref?.current?.contains(e.target)) {
        setBidOfferModal(false);
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
        <div>{isOfferCreate ? "Create an Offer" : "Make a Bid"}</div>
        <aside className={styles.TokenDetails}>
          <Image
            src={image}
            alt={name}
            width="100px"
            height="100px"
            className={styles.image}
          />
          <div className={styles.name}>
            <h3>{saleInfo.collection}</h3>
            <p>{name}</p>
            {isOfferCreate ? (
              <p>Price: {salePrice ? salePrice : 0}KCS</p>
            ) : (
              <p>
                {highestBid
                  ? `Highest Bid: ${highestBid}`
                  : `Starting Bid: ${startingBid}`}
              </p>
            )}
          </div>
        </aside>
        <hr />
        <aside className={styles.inputBarContainer}>
          <div className={styles.inputBar}>
            <label htmlFor="sale">
              {isOfferCreate ? "Offer value" : "Your bid"}
            </label>
            <input
              type="text"
              id="sale"
              onChange={(e) => setValue(() => e.target.value)}
              autoComplete="off"
              required=""
              className={styles.input}
              placeholder={
                isOfferCreate ? "Enter Offer value" : "Enter your bid"
              }
            />
            <span className={styles.asset}>KCS</span>
            {isOfferCreate && (
              <>
                <label htmlFor="valid">Offer expiry in Days </label>
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
              </>
            )}
          </div>
        </aside>
        <hr />
        <aside className={styles.saleInfo}>
          <div className={styles.PaymentMethod}>
            <p className={styles.container}>Pay with</p>
            <div className={styles.paymentBox}>
              <span onClick={() => setSelect(1)}>
                <PaymentMethodKCS selected={select == 1} />
              </span>
              <span onClick={() => setSelect(2)}>
                <PaymentMethodWKCS selected={select == 2} />
              </span>
            </div>
          </div>
        </aside>
        <hr />
        <aside className={styles.ExecuteTx}>
          {select === 1 && KCSBal < value ? (
            "Insufficient KCS Balance"
          ) : select === 2 && WKCS < value ? (
            "Insufficient WKCS Balance"
          ) : (
            <div className={styles.cta} onClick={execute}>
              {!value
                ? "Enter a value"
                : isOfferCreate
                ? "Create Offer"
                : "Create Bid"}
            </div>
          )}
        </aside>
      </motion.div>
    </motion.div>
  );
}
