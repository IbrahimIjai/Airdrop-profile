import styles from "./Styles/Section1.module.css";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
export default function AirdropSection_2({ animate_ }) {
  const { active, account, chainId, activate, deactivate } = useWeb3React();
  return (
    <div>
      {active && (
        <div className={styles.historycontaine}>
          <h3> Activities histories</h3>
          <hr className={styles.hr} />
          <div className={styles.transactions}>
            <div className={styles.historyHeader}>
              <p>NFT</p>
              <p>Transaction Event</p>
              <p>Date/Time</p>
            </div>
            {/* <hr/> */}
            <div className={styles.transactionDetails}>
              <div className={styles.NFTde}>
                <div className={styles.nftimagecont}>
                  <Image
                    src="/USDT.png"
                    objectFit="cover"
                    layout="fill"
                    alt="NFT Image"
                  />
                </div>
                <p>Divert Art #5555</p>
              </div>
              <div className={styles.events}> 
                <p>AuctionSale</p>
                <p>3KCS</p>
                <p>$20</p>
              </div>
              <div>
                <p>May 27th, 2022, 6:30pm</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const transactions = [
  {
    transactionsHash: "0xB249765ed8cEAf332c9C15705eF00c77725f3B19",
    transactionType: "NFT Sales",
    nftCollection: "",
    nftId: "",
    time: "1625488",
    amount: "2kcs",
  },
];
