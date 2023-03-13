import styles from "./BuyModal.module.css";
import { TfiFaceSad } from "react-icons/tfi";

export default function InsufficientFund({ coin }) {
  return (
    <div className={styles.InsufficientFundContainer}>
      <div className={styles.warning}>
        <TfiFaceSad />
        <p>Insufficient KCS {coin} Balance</p>
      </div>
    </div>
  );
}
