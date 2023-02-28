import styles from "../../styles/nft.module.css";
import Image from "next/image";
import Link from "next/link";
import KCS from "../../assets/KCS";
import MyLoader from "../../components/LayoutDesign/Skeleton";
import Shimmer from "../../components/LayoutDesign/Shimmer";
import { useContext, useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { DataContext } from "../../pages/collection/[collection]";
import { FETCH, server } from "../../utils/utils";
import useFooterInView from "../../hooks/useFooterInView";
import Liked from "../../assets/Liked";
import Like from "../../assets/Like";
import { HiOutlineShoppingCart } from "react-icons/hi";
import useTimeout from "../../hooks/useTimeout";
export default function ListedItems() {
  const {
    items,
    setItems,
    collection,
    loadSearch,
    searchInput,
    filterState,
    view,
    setBuyTokenModal,
    setItem,
  } = useContext(DataContext);
  const [searchInc, setSearchInc] = useState(20);
  const [filterInc, setFilterInc] = useState(20);
  const [loadMore, setLoadMore] = useState(false);
  const [allData, setAllData] = useState({});
  const [buyModalIn, setBuyModalIn] = useState(false);
  const [buyModalOut, setBuyModalOut] = useState(false);
  const bottom = useFooterInView();
  useEffect(() => {
    const caller = async () => {
      setLoadMore(true);
      if (
        searchInput !== "" &&
        (allData.searchInput === false ||
          typeof allData.searchInput === "undefined")
      ) {
        setSearchInc(searchInc + 20);
        const res = await search();
        if (!res || res.length === 0)
          setAllData((prevState) => ({
            ...prevState,
            searchInput: true,
          }));
      } else if (
        filterState !== "Recently Listed" &&
        (allData.filterState === false ||
          typeof allData.filterState === "undefined")
      ) {
        setFilterInc(filterInc + 20);
        const res = await sort();
        if (!res || res.length === 0)
          setAllData((prevState) => ({
            ...prevState,
            searchInput: true,
          }));
      }
      setLoadMore(false);
    };
    bottom && caller();
  }, [bottom]);
  async function search() {
    let res;
    if (searchInput !== "" && view === 0) {
      let url = `${server}/api/mongo/${collection}/search?q=${searchInput}&inc=${searchInc}`;
      const data = await FETCH(url);
      if (data !== "Error fetching")
        setItems((prevItems) => [...prevItems, ...data]);
      res = data;
    }
    return res;
  }
  async function sort() {
    let res;
    if (view === 0) {
      let url = `${server}/api/mongo/${collection}/sort?q=${filterState}&inc=${filterInc}`;
      const data = await FETCH(url);
      if (data !== "Error fetching")
        setItems((prevItems) => [...prevItems, ...data]);
      res = data;
    }
    return res;
  }
  useTimeout(() => setBuyModalIn(false), 2000, [buyModalOut]);

  return (
    <>
      {loadSearch ? (
        <div className={styles.loadItemsFromSearch}>
          <BounceLoader color="#2fc0db" loading={loadSearch} />{" "}
        </div>
      ) : null}
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
                        <span>
                          <HiOutlineShoppingCart />
                          <i>Add to Cart</i>
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
          No (Listed) Item found
        </div>
      )}
    </>
  );
}
export function Buy({ nft, setBuyTokenModal, setItem }) {
  const handleBuyClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setBuyTokenModal(true);
    setItem(nft);
  };
  return (
    <div
      onClick={(e) => handleBuyClick(e)}
      className={styles.buyModalIn}
      style={{ pointerEvents: "auto" }}
    >
      <div>Buy</div>
    </div>
  );
}
