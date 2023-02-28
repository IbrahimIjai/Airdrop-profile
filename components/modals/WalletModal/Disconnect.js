import Link from "next/link";
import { motion } from "framer-motion";
import { FiCopy } from "react-icons/fi";
import { IoExitOutline } from "react-icons/io5";
import {
  disconnect_Backdrop,
  disconnect_modal,
} from "../../../utils/framermotion/Navbar";
import styles from "./WalletModal.module.css";
import { useRef, useEffect } from "react";
import { slice } from "../../../utils/utils";
import Blockie from "../../../utils/Blockies";

export default function DisconnectModal({
  account,
  setDisconnectOpen,
  disconnect,
  KCS,
  WKCS,
  copy,
  showNotification,
}) {
  const ref = useRef();
  useEffect(() => {
    const modalRef = (e) => {
      try {
        if (!ref?.current?.contains(e.target)) {
          setDisconnectOpen(false);
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
      className={styles.Disconnect}
    >
      <motion.div
        ref={ref}
        variants={disconnect_modal}
        className={styles.smallBoard}
      >
        <div className={styles.userDetails}>
          <Blockie address={account} />
          <Link href={`https://scan.kcc.io/address/${account ? account : ""}`}>
            <a>
              <h1> {slice(account)} </h1>
            </a>
          </Link>
          <p className={styles.balance}>
            <span> {KCS} KCS</span>
            <span> {WKCS} WKCS</span>
          </p>
        </div>
        <div className={styles.bottom}>
          <div className={styles.icons} onClick={copy}>
            <FiCopy className={styles.clipboard} />
            {showNotification ? <h3>address copied</h3> : <h3>Copy Address</h3>}
          </div>
          <div className={styles.icons} onClick={disconnect}>
            <IoExitOutline />
            <h3>Disconnect</h3>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
