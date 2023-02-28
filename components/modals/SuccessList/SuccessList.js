import { FcApproval } from "react-icons/fc";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiCopy } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";
import { RxExternalLink } from "react-icons/rx";
import { BiWallet } from "react-icons/bi";

// import {
//   disconnect_Backdrop,
//   disconnect_modal,
// } from "../../../utils/framermotion/Navbar";
import styles from "./SuccessBuy.module.css";
import { useState, useRef, useEffect } from "react";
import Blockie from "../../../utils/Blockies";
export default function SucessBuy({ setSuccessBuyOpen, openSuccessBuy }) {
  const { active, account, chainId, library, activate, deactivate } =
    useWeb3React();
  const ref = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (openSuccessBuy && ref.current && !ref.current.contains(e.target)) {
        setSuccessBuyOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [openSuccessBuy, setSuccessBuyOpen]);

  return (
    <motion.div className={styles.backdrop}>
      <motion.div className={styles.card} ref={ref}>
        <div>
          <FcApproval className={styles.icon} size="8em" />
        </div>
        <div className={styles.successtextcont}>
          <p className={styles.successText}>List/Auction successful!</p>
          <p className={styles.cost}>2KCS approx. $20</p>
        </div>
        <div className={styles.wallet}>
        <div>
          <Blockie />
        </div>
          <p>
            wallet: {"  "} {`${account.slice(0, 5)}...${account.slice(39, 42)}`}{" "}
          </p>
        </div>
        <div className={styles.purchasedetails}>
          <p>transaction hash</p>
          <div className={styles.nftdetails}>
            <div className={styles.nftimg}>
              <Image
                src="/bannerProfile.png"
                layout="fill"
                objectFit="cover"
                alt="NFT0"
              />
            </div>
            <div>
              <p>Kucoin Lumen#2</p>
              <p>contract address</p>
            </div>
          </div>
        </div>
        <div className={styles.button}>Done</div>
      </motion.div>
    </motion.div>
  );
}
