import Link from "next/link";
import { motion } from "framer-motion";
import { FiCopy } from "react-icons/fi";
import { default as KCSLogo } from "../../../assets/KCS";
import { default as WKCSLogo } from "../../../assets/WKCS";
import { RxExternalLink } from "react-icons/rx";
import { BiWallet } from "react-icons/bi";
import {
  disconnect_Backdrop,
  disconnect_modal,
} from "../../../utils/framermotion/Navbar";
import styles from "./WalletModal.module.css";
import { useRef, useEffect } from "react";
import { slice } from "../../../utils/utils";

export default function Cart({ KCS, WKCS, setOpenCart }) {
  const ref = useRef();
  useEffect(() => {
    const modalRef = (e) => {
      try {
        if (!ref?.current?.contains(e.target)) {
          setOpenCart(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    document.addEventListener("mousedown", modalRef);
    return () => document.removeEventListener("mousedown", modalRef);
  });
  return (
    <motion.div
      variants={disconnect_Backdrop}
      initial="init"
      animate="final"
      exit="exit"
      className={styles.Cart}
    >
      <motion.div
        ref={ref}
        variants={disconnect_modal}
        className={styles.smallBoard}
      >
        <div className={styles.userDetails}>
          <div className={styles.userdetailsHead}>
            <div className={styles.conectedText}>
              <p>Cart items</p>
            </div>
          </div>
          <div className={styles.walletBal}>
            <div className={styles.icon}>
              <BiWallet /> <p>Wallet Balance</p>
            </div>
            <p className={styles.balance}>
              <span>
                {" "}
                <KCSLogo width={22} height={22} /> KCS
              </span>{" "}
              <span> {KCS}</span>
            </p>
            <p className={styles.balances}>
              <span>
                <WKCSLogo width={22} height={22} /> WKCS
              </span>{" "}
              <span> {WKCS}</span>
            </p>
          </div>
        </div>
        <button>Purchase</button>
      </motion.div>
    </motion.div>
  );
}
