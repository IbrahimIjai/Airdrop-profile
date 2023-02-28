import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { backdrop, modal } from "../../../utils/framermotion/Navbar";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect, useRef } from "react";
import styles from "./WalletModal.module.css";
export default function ConnectModal({ setConnectOpen, connect, connectWC }) {
  const ref = useRef();
  useEffect(() => {
    const outRef = (e) => {
      if (!ref?.current?.contains(e.target)) {
        setConnectOpen(false);
      }
    };
    document.addEventListener("mousedown", outRef);
    return () => document.removeEventListener("mousedown", outRef);
  });
  return (
    <motion.div
      variants={backdrop}
      initial="init"
      animate="final"
      exit="exit"
      className={styles.Connect}
    >
      <motion.div variants={modal} className={styles.modalMenu} ref={ref}>
        <div className={styles.modalInternal}>
          <div className={styles.modalHeader}>
            <h3>Connect Wallet</h3>
            <div className={styles.closeModal}>
              <AiOutlineCloseCircle onClick={() => setConnectOpen(false)} />
            </div>
          </div>
          <div className={styles.wallets}>
            <div className={styles.wallet} onClick={connect}>
              <Image
                src="/metamask.png"
                width={40}
                height={40}
                alt="imagelogo"
              />
              <span>MetaMask</span>
            </div>
            <div className={styles.wallet} onClick={connect}>
              <Image
                src="/tokenpocket.png"
                width={40}
                height={40}
                alt="imagelogo"
              />
              <span>Token Pocket</span>
            </div>
            <div className={styles.wallet} onClick={connectWC}>
              <Image src="/wallet.png" width={40} height={40} alt="imagelogo" />
              <span>Wallet Connect</span>
            </div>
            <div className={styles.wallet} onClick={connect}>
              <Image
                src="/kuwallet.jpg"
                width={40}
                height={40}
                alt="imagelogo"
              />
              <span>KuWallet</span>
            </div>
          </div>
          <div className={styles.tutorial}>
            <Link href="https://docs.distant.finance">
              <a>Learn how to connect</a>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
