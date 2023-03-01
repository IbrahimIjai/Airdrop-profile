import styles from "./Styles/Section1.module.css";
import { useState, useEffect } from "react";
import { ImGift } from "react-icons/im";
import { motion } from "framer-motion";
import { useWeb3React } from "@web3-react/core";
import Connect from "../../constants/Connect";
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
                <span>Congratualtions,</span>{" "}
                <span>You have earned 2 Null-points</span>
              </p>
              <div className={styles.zerobtncont}>
                <div className={styles.zerobbtn}>What are Null-points?</div>
                <div className={styles.zerobbtn}>
                  How to earn void points
                </div>{" "}
              </div>
            </div>
          ) : (
            <div className={styles.zeropoint}>
              <div className={styles.oopscontainer}>
                <span>Oops!</span>{" "}
                <span>it looks like you have not earned any void point. </span>
              </div>
              <div className={styles.zerobtncont}>
                <Link href="#How_to">
                  <p className={styles.zerobbtn}>How to earn void points</p>
                </Link>{" "}
                <Link href="#How_to">
                  <p className={styles.zerobbtn}>
                    Benefits of earning void points
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.inactiveMsg}>
          <p>Welcome to Distant Finance Point-Based Airdrop portal</p>
          <div>
            <span className={styles.Connect}>Connect</span>
            {"   "}your wallet to see your null-point and activities
          </div>
        </div>
      )}
    </div>
  );
}
