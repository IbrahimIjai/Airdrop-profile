import styles from "./styles/popcol.module.css";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MyLoader from "../LayoutDesign/Skeleton";
import Shimmer from "../LayoutDesign/Shimmer";
import useMediaQuery from "../../hooks/useMediaQueryhooks";
import KCS from "../../assets/KCS";
import { POST, server } from "../../utils/utils";

const PopularCollection = ({ address }) => {
  const isMobile = useMediaQuery("(min-width: 750px)");
  const [topCollections, setTopCollections] = useState(null);
  useEffect(() => {
    const main = async () => {
      const url = `${server}/api/blockchain/topcollections`;
      const data = await POST(url, address);
      setTopCollections(data);
    };
    main();
  }, []);

  return (
    <div className={styles.Cointainer}>
      <div className={styles.Header}>
        <span className={styles.HeaderTittle}>Top Collections</span>
        <span className={styles.HeaderParagraph}>
          NFT Collections and statistics
        </span>
      </div>
      <div className={styles.topCollections}>
        <div className={styles.head}>
          <div className={styles.collection}>Collection</div>
          {isMobile ? <div>Floor</div> : <div>Listed</div>}
          <div>Volume</div>
          <div>Top Sale</div>
          <div>Listed</div>
          <div>Supply</div>
        </div>
        <div className={styles.body}>
          {!topCollections ? (
            <div className={styles.skeletonWrapper}>
              <div>
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
              </div>
              <Shimmer />
            </div>
          ) : topCollections.length > 0 ? (
            topCollections.map((collection, i) => (
              <Link key={i} href={`/collection/${collection.address}`}>
                <a>
                  <div className={styles.key}>
                    <div className={styles.count}>
                      <div>
                        <div className={styles.imageContainer}>
                          <div className={styles.image}>
                            <Image src={collection.image} layout="fill" />
                          </div>
                        </div>
                        <div className={styles.name}>
                          <p>{collection.name}</p>
                          {isMobile ? null : (
                            <span className={styles.mobileFloor}>
                              Floor:{" "}
                              {collection.floor ? (
                                <span className={styles.contentFloor}>
                                  {" "}
                                  <KCS width={18} height={18} />{" "}
                                  {collection.floor}
                                </span>
                              ) : (
                                "NL"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isMobile ? (
                      <div className={styles.content}>
                        {collection.floor ? (
                          <span className={styles.contentFloor}>
                            {" "}
                            <KCS width={18} height={18} /> {collection.floor}
                          </span>
                        ) : (
                          "NL"
                        )}{" "}
                      </div>
                    ) : (
                      <div className={styles.content}>{collection.items}</div>
                    )}
                    <div className={styles.content}>
                      {" "}
                      {collection.totalVolume == 0
                        ? `-`
                        : `$${collection.totalVolume}`}{" "}
                    </div>
                    <div className={styles.content}>
                      {" "}
                      {collection.topSale == 0
                        ? `-`
                        : `$${collection.topSale}`}{" "}
                    </div>
                    <div className={styles.content}> {collection.items} </div>
                    <div className={styles.content}>
                      {" "}
                      {collection.totalSupply}{" "}
                    </div>
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <div className={styles.notActive}>
              Collection data not fully synced
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(PopularCollection);
