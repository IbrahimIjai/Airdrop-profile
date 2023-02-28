import styles from "./Styles/Section1.module.css";
export default function AirdropSection_2({ animate_ }) {

  return (
    <div className={styles.historycontaine}>
     <h3> Activities histories</h3>
      <hr className={styles.hr}/>
      <div className="transactions">

      </div>
    </div>
  );
}

const transactions =[
  {
    transactionsHash: "0xB249765ed8cEAf332c9C15705eF00c77725f3B19",
    transactionType:"NFT Sales",
    nftCollection:"",
    nftId:"",
    time:"1625488",
    amount: "2kcs"
  }
]
