import styles from "./Styles/Section1.module.css";
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
export default function AirdropSection_1() {
  const { active, account } = useWeb3React();
  const [points, setPoints] = useState(1);
  const getPoints = async ()=> {
    try{
      const response = await fetch(`http://localhost:3001/api/${account}`);
    const data = await response.json();
    const points = data.points;
    setPoints(points)
    }catch(error){
      
    }
    
  }
  useEffect(()=>{
    active && getPoints()
  } ,[active])
  return (
    <div className={styles.container}>
      {active ? (
        <div>
          {points && points > 0 ? (
            <div>
              <p className={styles.congrats}>
                <span>Congratualtions,</span>{" "}
                <span>You have earned {points} Null-points</span>
              </p>
              <div className={styles.zerobtncont}>
                <Link href="How_to_earn_null_points" smooth={true}>
                  <div className={styles.zerobbtn}>What are Null-points?</div>
                </Link>
                <Link href="How_to_earn_null_points" smooth={true}>
                  <div className={styles.zerobbtn}>How to earn void points</div>
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.zeropoint}>
              <div className={styles.oopscontainer}>
                <span>Oops!</span>{" "}
                <span>it looks like you have not earned any void point. </span>
              </div>
              <div className={styles.zerobtncont}>
                <Link href="How_to_earn_null_points">
                  <div className={styles.zerobbtn}>How to earn void points</div>
                </Link>{" "}
                <Link href="How_to_earn_null_points">
                  <div className={styles.zerobbtn}>
                    Benefits of earning void points
                  </div>
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
