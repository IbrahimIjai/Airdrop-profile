import useFooterInView from "../../hooks/useFooterInView";
import useTimeout from "../../hooks/useTimeout";
import Liked from "../../assets/Liked";
import Like from "../../assets/Like";
import Image from "next/image";
import Link from "next/link";
import KCS from "../../assets/KCS";
import MyLoader from "../LayoutDesign/Skeleton";
import Shimmer from "../LayoutDesign/Shimmer";
import { useEffect, useState } from "react";
import { FETCH, server } from "../../utils/utils";
import styles from "../../styles/nft.module.css";
import { Buy } from "../Collection/ListedItems";
export default function ExploreAuctions() {
  const [items, setItems] = useState(null);
  const [buyModalIn, setBuyModalIn] = useState(false);
  const [buyModalOut, setBuyModalOut] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [allData, setAllData] = useState(false);
  const [Item, setItem] = useState(null);
  const [initLoad, setInitLoad] = useState(false);
  const [inc, setInc] = useState(0);
  const bottom = useFooterInView();
  useTimeout(() => setBuyModalIn(false), 2000, [buyModalOut]);
  useEffect(() => {
    async function fetchItems() {
      setLoadMore(true);
      const res = await fetchListings();
      if (!res || res.length === 0) setAllData(true);
      setInc(inc + 20);
      setLoadMore(false);
    }
    if (initLoad && bottom && !allData) {
      fetchItems();
    } else if (!initLoad) {
      setInitLoad(true);
      fetchItems();
    }
  }, [bottom]);

  async function fetchListings() {
    let url = `${server}/api/blockchain/explore?type=auctionSale&inc=${inc}`;
    const data = await FETCH(url);
    if (data !== "Error fetching") {
      if (items) {
        setItems((prevItems) => [...prevItems, ...data]);
      } else setItems(data);
    }
    let res = data;
    return res;
  }
  return (
    <>
      {!items ? (
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
      ) : items.length > 0 ? (
        <>
          <div className={styles["nftFlex"] + " " + styles["nftGrid"]}>
            {items.map((nft, i) => {
              return (
                <div className={styles.card} key={i}>
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
                      <div
                        className={styles.valueContainer}
                        style={{ height: nft.salePrice ? "" : "auto" }}
                        onMouseOver={
                          nft.salePrice
                            ? () => setBuyModalIn(true)
                            : () => setBuyModalIn(false)
                        }
                        onMouseOut={() => setBuyModalOut(!buyModalOut)}
                      >
                        <div className={styles.values}>
                          {" "}
                          {nft.salePrice ? (
                            <div className={styles.saleValue}>
                              <KCS width={15} height={15} />{" "}
                              <p>{nft.salePrice}</p>
                            </div>
                          ) : (
                            "Unlisted"
                          )}
                        </div>
                        {buyModalIn && (
                          <Buy
                            nft={nft}
                            setBuyTokenModal={setBuyTokenModal}
                            setItem={setItem}
                          />
                        )}
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
          {loadMore && <div style={{ margin: "auto" }}>Loading</div>}
        </>
      ) : (
        <div
          className={styles.notActive}
          style={{ height: "50vh", position: "relative" }}
        >
          No Live Auctions
        </div>
      )}
    </>
  );
}
