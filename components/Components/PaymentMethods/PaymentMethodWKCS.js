import React, { useContext } from "react";
import WKCS from "../../../assets/WKCS";
import { BalanceContext } from "../../../context/BalanceContext";
import styles from "./PaymentMethod.module.css";

const PaymentMethodWKCS = ({ selected }) => {
  const balance = useContext(BalanceContext);
  return (
    <div
      className={styles.box}
      style={{
        background: selected ? "#fff" : "",
        color: selected ? "black" : "initial",
      }}
    >
      <div className={styles.logoBox}>
        <WKCS width={18} height={18} />
        <p className={styles.label}>WKCS</p>
      </div>
      <div className={styles.balanceBox}>
        <span className={styles.balanceLabel}>Balance:</span>
        <span className={styles.balance}>{balance.WKCS}</span>
      </div>
    </div>
  );
};
export default PaymentMethodWKCS;
