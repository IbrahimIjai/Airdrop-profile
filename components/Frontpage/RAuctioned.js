import styles from "./styles/RListed.module.css";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect, useRef } from "react";
import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
import Link from "next/link";
import MyLoader from "../LayoutDesign/Skeleton";
import Shimmer from "../LayoutDesign/Shimmer";
import KCS from "../../assets/KCS";
import { FETCH, server } from "../../utils/utils";

const RecentlyAuctioned = () => {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const containerRef = useRef(null);
  function handleScrollLeft() {
    containerRef.current.scrollLeft -= 150;
    handleScroll();
  }
  function handleScrollRight() {
    containerRef.current.scrollLeft += 150;
    handleScroll();
  }
  function handleScroll() {
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollWidth > clientWidth + scrollLeft);
  }
  const { active } = useWeb3React();
  const [runEffect, setRunEffect] = useState(false);
  const init = setTimeout(() => {
    setRunEffect(true);
  }, 300);
  if (active || !active) {
    setTimeout(() => {
      setRunEffect(false);
    }, 1200);
    clearTimeout(init);
  }
  const [data, setData] = useState(null);
  useEffect(() => {
    const main = async () => {
      const url = `${server}/api/blockchain/recentauctions`;
      const listings = await FETCH(url);
      setData(listings);
    };
    main();
  }, [runEffect]);
  return (
    <main className={styles.main}>
      <div className={styles.text}>
        <h3>Live Auctions</h3>
      </div>
      {data && data.length > 0 && showLeft ? (
        <RxChevronLeft
          className={styles.left}
          size="1.5em"
          onClick={handleScrollLeft}
        />
      ) : null}
      {data && data.length > 0 && showRight ? (
        <RxChevronRight
          className={styles.right}
          size="1.5em"
          onClick={handleScrollRight}
        />
      ) : null}
      <div className={styles.SliderContainer}>
        <div className={styles.cards} ref={containerRef}>
          {data ? (
            data.length > 0 ? (
              data.map((nft, i) => (
                <Link
                  key={i}
                  href={`/collection/${nft.collection}/${nft.tokenId}`}
                >
                  <a>
                    <div className={styles.imageContainer}>
                      <Image
                        src={nft.image}
                        layout="fill"
                        objectFit="cover"
                        style={{ padding: "0 20px" }}
                        alt="Nft image"
                      />
                      <div className={styles.description}>
                        <h3>{nft.name}</h3>
                        <p>
                          Bid:{" "}
                          <span>
                            <KCS width={18} height={18} />
                            {nft.startingBid}{" "}
                          </span>
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              <div className={styles.notActive}>
                No Live Auctions are ongoing at the moment
              </div>
            )
          ) : (
            <div className={styles.skeletonWrapper}>
              <div className={styles.skeletonLoader}>
                <MyLoader type="recentlylisted" />
                <MyLoader type="recentlylisted" />
                <MyLoader type="recentlylisted" />
                <MyLoader type="recentlylisted" />
                <MyLoader type="recentlylisted" />
                <MyLoader type="recentlylisted" />
                <MyLoader type="recentlylisted" />
                <MyLoader type="recentlylisted" />
              </div>
              <Shimmer />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
export default React.memo(RecentlyAuctioned);
