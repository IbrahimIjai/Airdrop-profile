import useFooterInView from "../../hooks/useFooterInView";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import Liked from "../../assets/Liked";
import Like from "../../assets/Like";
import Image from "next/image";
import Link from "next/link";
import KCS from "../../assets/KCS";
import MyLoader from "../LayoutDesign/Skeleton";
import Shimmer from "../LayoutDesign/Shimmer";
import { useEffect, useState } from "react";
import {
  addToCart,
  DCL,
  FETCH,
  remove,
  server,
  tokenExistsInCart,
} from "../../utils/utils";
import styles from "../../styles/nft.module.css";
import { Buy } from "../Collection/ListedItems";
export default function ExploreDCL({ setBuyTokenModal, setItem }) {
  const [items, setItems] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [allData, setAllData] = useState(false);
  const [initLoad, setInitLoad] = useState(false);
  const [inc, setInc] = useState(0);
  const bottom = useFooterInView();
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

  const [showBuyModal, setShowBuyModal] = useState(
    Array(items ? items.length : 1).fill(false)
  );
  const handleMouseEnter = (index) => {
    const newShowBuyModal = [...showBuyModal];
    newShowBuyModal[index] = true;
    setShowBuyModal(newShowBuyModal);
  };
  const handleMouseLeave = (index) => {
    const newShowBuyModal = [...showBuyModal];
    newShowBuyModal[index] = false;
    const timer = setTimeout(() => {
      setShowBuyModal(newShowBuyModal);
    }, 400);
    return () => clearTimeout(timer);
  };
  const addToCartFunction = (nftData, event) => {
    event.preventDefault();
    event.stopPropagation();
    const { collection, tokenId } = nftData;
    addToCart(collection, nftData, tokenId);
  };
  const removeFromCart = (nftData, event) => {
    event.preventDefault();
    event.stopPropagation();
    const { collection, tokenId } = nftData;
    remove(collection, tokenId);
  };
  const tokenExists = (nftData) => {
    const { collection, tokenId } = nftData;
    return tokenExistsInCart(collection, tokenId);
  };
  async function fetchListings() {
    let url = `${server}/api/mongo/${DCL}/sort?q=All Items&inc=${inc}`;
    const data = await FETCH(url);
    if (data !== "Error fetching") {
      if (items) {
        setItems((prevItems) => [...prevItems, ...data]);
      } else {
        setItems(data);
      }
    }
    let res = data;
    return res;
  }
  useEffect(() => {
    function checkExists() {
      let newItems = items?.map((item) => {
        let exists = tokenExists(item);
        return { ...item, exists };
      });
      setItems(newItems);
    }
    items && checkExists();
  }, [setItems]);
  console.log(items, "ITEMS");
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
                    <a
                      onClick={(e) => {
                        if (showBuyModal[i]) {
                          e.preventDefault();
                        }
                      }}
                    >
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
                        onMouseEnter={
                          nft.salePrice
                            ? () => handleMouseEnter(i)
                            : () => handleMouseLeave(i)
                        }
                        onMouseLeave={() => handleMouseLeave(i)}
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
                        {showBuyModal[i] && (
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
                        {nft.exists ? (
                          <span onClick={(e) => removeFromCart(nft, e)}>
                            <MdOutlineClose />
                            <i>Remove</i>
                          </span>
                        ) : (
                          <span onClick={(e) => addToCartFunction(nft, e)}>
                            <HiOutlineShoppingCart />
                            <i>Add to Cart</i>
                          </span>
                        )}
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
          No Item found
        </div>
      )}
    </>
  );
}
