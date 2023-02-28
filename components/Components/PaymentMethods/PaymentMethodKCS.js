import React, { useContext } from "react";
import KCS from "../../../assets/KCS";
import { BalanceContext } from "../../../context/BalanceContext";
import styles from "./PaymentMethod.module.css";

const PaymentMethodKCS = ({ selected }) => {
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
        <KCS width={18} height={18} />
        <p className={styles.label}>KCS</p>
      </div>
      <div className={styles.balanceBox}>
        <span className={styles.balanceLabel}>Balance:</span>
        <span className={styles.balance}>{balance.KCS}</span>
      </div>
    </div>
  );
};

export default PaymentMethodKCS;
