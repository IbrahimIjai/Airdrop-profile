import styles from "../../styles/nftId.module.css";
import { CgDanger } from "react-icons/cg";
import { MdOutlineVerifiedUser } from "react-icons/md";
import Link from "next/link";
import { useContext, useState } from "react";
import { slice } from "../../utils/utils";
import { NFTContext } from "../../pages/collection/[collection]/[nftId]";
import Blockie from "../../utils/Blockies";
export default function CollectionAndOwnerInfo() {
  const { ipfsData, collectionData, collection, saleInfo, currentAccount } =
    useContext(NFTContext);
  let tokenOwner =
    saleInfo?.saleType === "auctionSale" ? saleInfo.seller : saleInfo.owner;
  let isOwner = tokenOwner === currentAccount;
  const [verificationDisplay, setVerificationDisplay] = useState(false);
  return (
    <>
      <div className={styles.openContent}>
        <div className={styles.openContentDetails}>
          <p>
            <Link href={`/collection/${collection}`}>
              <a>{ipfsData.collectionName} </a>
            </Link>
            {collectionData ? (
              <span
                className={styles.verified}
                onMouseOver={() => setVerificationDisplay(true)}
                onMouseOut={() =>
                  setTimeout(() => setVerificationDisplay(false), 2000)
                }
              >
                {collectionData.collectionStatus === 0 ? (
                  <CgDanger />
                ) : (
                  <MdOutlineVerifiedUser />
                )}
                {verificationDisplay ? (
                  collectionData.collectionStatus === 0 ? (
                    <span>unverified!</span>
                  ) : (
                    <span>Verified</span>
                  )
                ) : null}
              </span>
            ) : null}
          </p>
          <h2>{ipfsData.name}</h2>
          <em>
            <span>Owned by</span>
            <Link href={`/profile/${tokenOwner}`} prefetch={false}>
              <a>
                <Blockie address={tokenOwner} />{" "}
                {isOwner ? "You" : slice(tokenOwner)}
              </a>
            </Link>
          </em>
        </div>
      </div>
    </>
  );
}
