import styles from "./UpdateModal.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useContext } from "react";
import {
  FUNCTIONS,
  updateListing,
  updateOfferKCS,
  updateOfferWKCS,
} from "../../NFTID/Functions";
import { utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { modal_backdrop, _modal } from "../../../utils/framermotion/NFTID";
import { FETCH, PUT, server } from "../../../utils/utils";
import { NFTContext } from "../../../pages/collection/[collection]/[nftId]";
import { ACTIONS } from "../../Notifications/Notification";
import { BalanceContext } from "../../../context/BalanceContext";
import PaymentMethodKCS from "../../Components/PaymentMethods/PaymentMethodKCS";
import PaymentMethodWKCS from "../../Components/PaymentMethods/PaymentMethodWKCS";
export default function UpdateModal() {
  const {
    ipfsData,
    collection,
    nftId,
    currentAccount,
    setUpdateModal,
    setLoading,
    closeTxn,
    saleInfo,
    updateModalType,
  } = useContext(NFTContext);
  const { KCS: KCSBal, WKCS, setKCS } = useContext(BalanceContext);
  const { library } = useWeb3React();
  const [value, setValue] = useState(0);
  const [prevValue, setPrevValue] = useState(0);
  const [select, setSelect] = useState(1);
  const { salePrice } = saleInfo;

  const isOfferUpdate = updateModalType === FUNCTIONS.UPDATEOFFER;
  console.log(typeof KCSBal, typeof value, typeof prevValue);
  useEffect(() => {
    const getPriorOffer = async () => {
      let url = `${server}/api/blockchain/${collection}/${nftId}/useroffer?account=${currentAccount}`;
      let userOffer = await FETCH(url);
      setPrevValue(userOffer.offerValue);
    };
    currentAccount && getPriorOffer();
  }, [currentAccount]);

  async function updateTokenListing() {
    if (value < 0) {
      closeTxn(ACTIONS.MESSAGE, "Value cannot be less than 0");
      setUpdateModal(false);
      throw new Error("Value cannot be less than 0");
    }
    const signer = await library.getSigner();
    let _value = utils.parseEther(value);
    let txn;
    setLoading(true);
    if (!isOfferUpdate) {
      let dataBody = { salePrice: value };
      txn = await updateListing(signer, _value, collection, nftId);
      let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.UPDATELISTING}`;
      if (txn) {
        await PUT(url, dataBody);
        closeTxn(ACTIONS.TXN, txn);
      } else closeTxn(ACTIONS.ERROR);
    } else {
      let dataBody = { offerValue: value, offerCreator: currentAccount };
      if (select === 1) {
        txn = await updateOfferKCS(signer, _value, collection, nftId);
      } else if (select === 2) {
        txn = await updateOfferWKCS(signer, _value, collection, nftId);
      }
      let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.UPDATEOFFER}`;
      if (txn) {
        setKCS(Number(KCSBal) - Number(value));
        await PUT(url, dataBody);
        closeTxn(ACTIONS.TXN, txn);
      } else closeTxn(ACTIONS.ERROR);
    }
    setUpdateModal(false);
  }

  const ref = useRef();
  useEffect(() => {
    const clickOut = (e) => {
      if (!ref?.current?.contains(e.target)) {
        setUpdateModal(false);
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
        <div>Update Prices</div>
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
        <hr />
        <aside className={styles.inputBarContainer}>
          <div className={styles.inputBar}>
            <label htmlFor="sale">New Value</label>
            <input
              type="text"
              id="sale"
              onChange={(e) => setValue(() => e.target.value)}
              autoComplete="off"
              required=""
              className={styles.input}
              placeholder={
                !isOfferUpdate
                  ? "Enter updated sale price"
                  : "Input new bidding increment"
              }
            />
            <span className={styles.asset}>KCS</span>
            {isOfferUpdate ? (
              <p>
                Previous proposed offer{" "}
                <span>{prevValue ? prevValue : 0}KCS</span> ($8.79)
              </p>
            ) : (
              <p>
                Prior sale price{" "}
                <span>{saleInfo?.salePrice ? saleInfo?.salePrice : 0}KCS</span>{" "}
                ($8.79)
              </p>
            )}
          </div>
        </aside>
        <hr />
        {isOfferUpdate && (
          <>
            <aside className={styles.saleInfo}>
              <section>
                Your total offer amount now stands at{" "}
                {Number(prevValue) + Number(value)}KCS
              </section>
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
          </>
        )}
        <aside className={styles.ExecuteTx}>
          {!isOfferUpdate ? (
            select === 1 && KCSBal < salePrice ? (
              "Insufficient KCS Balance"
            ) : select === 2 && WKCS < salePrice ? (
              "Insufficient WKCS Balance"
            ) : (
              <div className={styles.cta} onClick={updateTokenListing}>
                Update Sale Price Information
              </div>
            )
          ) : select === 1 && KCSBal < value ? (
            "Insufficient KCS Balance"
          ) : select === 2 && WKCS < value ? (
            "Insufficient WKCS Balance"
          ) : (
            <div className={styles.cta} onClick={updateTokenListing}>
              Supplement Initial Offer
            </div>
          )}
        </aside>
      </motion.div>
    </motion.div>
  );
}
