import { GiArrowScope } from "react-icons/gi";
import styles from "./Styles/Section1.module.css";
export default function Howto() {
  return (
    <div id="How_to" className={styles.section3}>
      {headtext.map((text, i) => {
        return (
          <div id={text.id} className={styles.textcont}>
            <h2>{text.title}</h2>
            <p>{text.text}</p>
          </div>
        );
      })}

      <div id="How_to_Earn_Null_Points" className={styles.listcont}>
        <h2>How to earn void points</h2>
        {howto.map((text, intex) => {
          return (
            <div className={styles.list}>
              <div><GiArrowScope size="1.5rem" color="#2fc0db"/></div>
              <p>{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const headtext = [
  {
    id: "How",
    title: "How it works",
    text: " The Distant Finance point-based system rewards users for a range of activities on the platform, including listing and selling NFTs, minting NFTs, instant selling, under and over collateralized lending, and other tasks. Each time a user engages in one of these activities, they earn null points. The more activities a user participates in, the more null points they earn.After the airdrop event, users will receive Void Tokens based on the number of Null-Points they have acquired. The more Null-Points a user has earned, the more Void Tokens they will receive. This incentivizes users to engage in more activities on the platform, contributing to its success and earning exciting rewards in the process. So start earning those Null-Points today and get ready for the next exciting Void Token airdrop event!",
  },
  {
    id: "NullPoint",
    title: "Null-points",
    text: " Null-Points provide users with a clear and measurable way to track their contributions to the platform. This not only encourages users to engage with the platform more often, but also provides them with a sense of accomplishment and satisfaction as they see their Null-Points accumulate.",
  },
];

const howto = [
  " Minting NFTs: Distant Finance marketplace offers an NFT Minter feature that allows you to create your own NFTs. By using this feature, you can earn Void Points for every NFT that you mint.",
  " Collection Offer: If you have a collection of NFTs that you want to sell, our marketplace offers a Collection Offer feature that allows you to sell them all at once. By using this feature, you can earn Void Points for every NFT that you sell as part of the collection.",
  " Instant-Sell Feature: we offers an Instant-Sell feature that allows you to sell your NFTs immediately. By using this feature, you can earn Void Points for every NFT that you sell.",
  "Auction: If you want to sell your NFTs through an auction, Distant Finance allows you to do so. By using this feature, you can earn Void Points for every NFT that you sell through the auction.",
  " Single Offer: If you prefer to sell your NFTs individually, Distant Finance offers a Single Offer feature that allows you to do so. By using this feature, you can earn Void Points for every NFT that you sell.",
  "Buying NFTs: If you want to purchase NFTs on our marketplace, you can earn Void Points for every NFT that you buy.",
  " Listing/Selling NFTs: If you have NFTs that you want to sell, you can list them on here and earn Void Points for every NFT that you sell.",
  "Under-Collateralized and Over-Collateralized Lending and Borrowing: Our lending platform offers both under-collateralized and over-collateralized lending and borrowing options. By using these features, you can earn Void Points for every successful transaction.",
  " P2P Lending: There is an option on the lending protocol which also allows for peer-to-peer lending. By participating in P2P lending, you can earn Void Points for every successful transaction.",
];
