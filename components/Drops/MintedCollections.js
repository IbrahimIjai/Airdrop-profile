import styles from "../Frontpage/styles/popcol.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import MyLoader from "../LayoutDesign/Skeleton";
import Shimmer from "../LayoutDesign/Shimmer";
import useMediaQuery from "../../hooks/useMediaQueryhooks";
import { POST, server } from "../../utils/utils";

const MintedCollections = ({ address }) => {
  const isMobile = useMediaQuery("(min-width: 750px)");
  const [mintedCollections, setMintedCollections] = useState(null);
  useEffect(() => {
    const main = async () => {
      const url = `${server}/api/blockchain/mintedcollections`;
      const data = await POST(url, address);
      setMintedCollections(data);
    };
    main();
  }, []);
  return (
    <div
      className={styles.Cointainer}
      style={{ marginTop: 0, paddingTop: "20px" }}
    >
      <div className={styles.Header}>
        <span className={styles.HeaderTittle}>Minted Collections</span>
        <p style={{ opacity: 0.9 }}>
          Enter the universe created by budding new Artists and Creators on the
          Distant Marketplace. <br /> Mint artworks, game items and collectibles
          from your favorite creators. <br /> All collections, up for your
          chosing, waiting to be discovered.
        </p>
      </div>
      <div className={styles.topCollections}>
        <div className={styles.head}>
          <div className={styles.collection}>Collection</div>
          {isMobile ? <div>Floor</div> : <div>Max Supply</div>}
          <div>Mint fee</div>
          <div>Total Supply</div>
          <div>Listed</div>
          <div>Max Supply</div>
        </div>
        <div className={styles.body}>
          {mintedCollections ? (
            mintedCollections.map((collection, i) => (
              <Link key={i} href={`/mint/${collection.contract}`}>
                <a>
                  <div className={styles.key}>
                    <div className={styles.count}>
                      <div>
                        <div className={styles.imageContainer}>
                          <div className={styles.image}>
                            <Image
                              src={collection.image}
                              layout="fill"
                              alt={collection.name}
                            />
                          </div>
                        </div>
                        <div className={styles.name}>
                          <p>{collection.name}</p>
                          {isMobile ? null : (
                            <span className={styles.mobileFloor}>
                              Floor:{" "}
                              {collection.floor ? `${collection.floor}` : "NL"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isMobile ? (
                      <div className={styles.content}>
                        {collection.floor ? `${collection.floor}` : "NL"}{" "}
                      </div>
                    ) : (
                      <div className={styles.content}>
                        {collection.maxSupply}
                      </div>
                    )}
                    <div className={styles.content}>{collection.mintFee}</div>
                    <div className={styles.content}>
                      {collection.totalSupply}
                    </div>
                    <div className={styles.content}>
                      {collection.floor ? `${collection.item}` : "NL"}{" "}
                    </div>
                    <div className={styles.content}>{collection.maxSupply}</div>
                  </div>
                </a>
              </Link>
            ))
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};
export default MintedCollections;
