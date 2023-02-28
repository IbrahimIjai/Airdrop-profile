import styles from "./Styles/Section1.module.css";
import { useState, useEffect } from "react";
import { ImGift } from "react-icons/im";
import { motion } from "framer-motion";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
export default function AirdropSection_1({ animate_ }) {
  const { active, account, chainId, activate, deactivate } = useWeb3React();
  const [points, setPoints] = useState(1);

  return (
    <div className={styles.container}>
      {active ? (
        <div>
          {points > 0 ? (
            <div>
            <p className={styles.congrats}>
              <span>Congratualtions,</span> <span>You have earned 2 void points</span>
            </p>
            <div className={styles.zerobtncont}>
                <div className={styles.zerobbtn}>How to earn void points</div>{" "}
                <div className={styles.zerobbtn}>
                  Benefits of earning void points
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.zeropoint}>
              <div className={styles.oopscontainer}>
                <span>Oops!</span>{" "}
                <span>it looks like you have not earned any void point. </span>
              </div>
              <div className={styles.zerobtncont}>
                <div className={styles.zerobbtn}>How to earn void points</div>{" "}
                <div className={styles.zerobbtn}>
                  Benefits of earning void points
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Connect your wallet to see your point and position</p>
        </div>
      )}
    </div>
  );
}
