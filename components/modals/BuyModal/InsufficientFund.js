import Link from "next/link";
import { useState } from "react";
import styles from "./BuyModal.module.css";
import { TfiFaceSad } from "react-icons/tfi";

export default function InsufficientFund({ coin }) {
  return (
    <div className={styles.InsufficientFundContainer}>
      <div className={styles.warning}>
        <TfiFaceSad />
        <p>Insufficient KCS {coin} Balance</p>
      </div>

      {/* <div className={styles.buyLink}>
        <p>
          Get {coin} at
          <Link href="https://kuswap.finance/#/swap">
            <span>Kuswap</span>
          </Link>{" "}
          or{" "}
          <Link href="https://app.mojitoswap.finance/swap">
            <span>Mojito</span>
          </Link>{" "}
        </p>
      </div> */}
    </div>
  );
}
