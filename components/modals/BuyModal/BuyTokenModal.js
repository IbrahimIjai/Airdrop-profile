import styles from "./BuyModal.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useContext } from "react";
import { buyTokenKCS, buyTokenWKCS, FUNCTIONS } from "../../NFTID/Functions";
import { utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { modal_backdrop, _modal } from "../../../utils/framermotion/NFTID";
import { DELETE, server } from "../../../utils/utils";
import { ACTIONS } from "../../Notifications/Notification";
import KCS from "../../../assets/KCS";
import PaymentMethodWKCS from "../../Components/PaymentMethods/PaymentMethodWKCS";
import PaymentMethodKCS from "../../Components/PaymentMethods/PaymentMethodKCS";
import { BalanceContext } from "../../../context/BalanceContext";
import { DataContext } from "../../../pages/collection/[collection]";

export default function BuyTokenModal() {
  const { KCS: KCSBal, WKCS, setKCS } = useContext(BalanceContext);
  const { collection, setBuyTokenModal, obj, closeTxn, setLoading, item } =
    useContext(DataContext);
  const { library } = useWeb3React();
  const [select, setSelect] = useState(1);
  const { salePrice, image, tokenId } = item;
  async function buyToken() {
    const signer = await library.getSigner();
    let _value = utils.parseEther(salePrice);
    setLoading(true);
    let txn;
    if (select === 1) {
      txn = await buyTokenKCS(signer, collection, tokenId, _value);
    } else txn = await buyTokenWKCS(signer, _value, collection, tokenId);
    let url = `${server}/api/mongo/${collection}/${tokenId}/modify?type=${FUNCTIONS.BUY}`;
    if (txn) {
      setKCS(KCSBal - salePrice);
      await DELETE(url);
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setBuyTokenModal(false);
  }

  const ref = useRef();
  useEffect(() => {
    const clickOut = (e) => {
      if (!ref?.current?.contains(e.target)) {
        setBuyTokenModal(false);
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
        <div>Checkout</div>
        <aside className={styles.TokenDetails}>
          <Image
            src={image}
            alt={item.name}
            width="100px"
            height="100px"
            className={styles.image}
          />
          <div className={styles.name}>
            <h3>{obj.name}</h3>
            <p>{item.name}</p>
          </div>
        </aside>
        <hr />
        <aside className={styles.saleInfo}>
          <h2>Price</h2>
          <div className={styles.price}>
            <span>
              {" "}
              <KCS />
            </span>
            <h1>{salePrice}</h1>
          </div>
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
          {select === 1 && KCSBal < salePrice ? (
            "Insufficient KCS Balance"
          ) : select === 2 && WKCS < salePrice ? (
            "Insufficient WKCS Balance"
          ) : (
            <div className={styles.cta} onClick={buyToken}>
              Buy Token
            </div>
          )}
        </aside>
      </motion.div>
    </motion.div>
  );
}
