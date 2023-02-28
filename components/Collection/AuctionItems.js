import styles from "../../styles/nft.module.css";
import KCS from "../../assets/KCS";
import Image from "next/image";
import MyLoader from "../../components/LayoutDesign/Skeleton";
import Shimmer from "../../components/LayoutDesign/Shimmer";
import Link from "next/link";
import { DataContext } from "../../pages/collection/[collection]";
import { useState, useEffect, useContext, useCallback } from "react";
import { FETCH, server } from "../../utils/utils";
import TimeStamp from "../../utils/Timestamp";
import Like from "../../assets/Like";
import Liked from "../../assets/Liked";
export default function AuctionItems() {
  const [auctionItems, setAuctionItems] = useState(null);
  const { collection } = useContext(DataContext);
  const fetchAuctionItems = useCallback(async () => {
    let url = `${server}/api/blockchain/${collection}/auction`;
    const response = await FETCH(url);
    setAuctionItems(response);
  }, [collection]);
  useEffect(() => {
    fetchAuctionItems();
  }, [collection]);

  return (
    <>
      {!auctionItems ? (
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonNftCard}>
            <MyLoader type="avatar" />
            <MyLoader type="avatar" />
            <MyLoader type="avatar" />
            <MyLoader type="avatar" />
            <MyLoader type="avatar" />
            <MyLoader type="avatar" />
          </div>
          <Shimmer />
        </div>
      ) : auctionItems.length > 0 ? (
        <div className={styles["nftFlex"] + " " + styles["nftGrid"]}>
          {auctionItems.map((nft) => {
            return (
              <div className={styles.card} key={nft.tokenId}>
                <Link
                  href={`/collection/${collection}/${nft.tokenId}`}
                  prefetch={false}
                >
                  <a>
                    <div className={styles.nft}>
                      <div className={styles.holster}>
                        <span className={styles.likes}>
                          <Liked /> 2
                        </span>
                        <div className={styles.nftImg}>
                          <div className={styles.nftGrayscale}>
                            <div className={styles.image}>
                              <Image
                                src={nft.image}
                                alt={nft.tokenId}
                                layout="fill"
                                objectFit="cover"
                                className={styles.image}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.name}>
                      <p>{nft.name}</p>
                    </div>
                    <div className={styles.valueContainer}>
                      <div className={styles.values}>
                        {" "}
                        <div className={styles.saleValue}>
                          <KCS width={15} height={15} />{" "}
                          <p>
                            {nft.highestBid == "0.0"
                              ? nft.startingBid
                              : nft.highestBid}
                          </p>
                        </div>
                        <div className={styles.saleValue}>
                          <TimeStamp timestamp={nft.closeAuctionTime} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <span>
                        <Like width="20px" height="20px" />
                      </span>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.notActive} style={{ height: "50vh" }}>
          No items on Auction
        </div>
      )}
    </>
  );
}
