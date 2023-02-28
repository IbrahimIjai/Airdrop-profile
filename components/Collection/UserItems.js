import styles from "../../styles/nft.module.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { FUNCTIONS, instantSale } from "../NFTID/Functions";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../pages/collection/[collection]";
import { DELETE, FETCH, PUT, server } from "../../utils/utils";
import KCS from "../../assets/KCS";
import { ACTIONS } from "../Notifications/Notification";

const style = {
  padding: "30px",
  borderRadius: "7px",
  minHeight: "0",
};

export default function UserItems() {
  const { library, account } = useWeb3React();
  const { setViewUserItems, topCollectionOffer, collection, closeTxn } =
    useContext(DataContext);
  const [userItems, setUserItems] = useState(null);
  async function instantSellFunction(tokenId) {
    const { offerCreator, value } = topCollectionOffer;
    const signer = await library.getSigner();
    const txn = await instantSale(signer, collection, tokenId, offerCreator);
    let dataBody = {
      offerCreator: offerCreator,
      offerValue: value,
      nftAmount: 1,
    };
    let url = `${server}/api/mongo/${collection}/${tokenId}/modify?type=${FUNCTIONS.BUY}`;
    let uri = `${server}/api/mongo/${collection}/collectionoffer?type=${FUNCTIONS.INSTANTSALE}`;
    if (txn) {
      await DELETE(url);
      await PUT(uri, dataBody);
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
  }
  useEffect(() => {
    const fetchUserItems = async () => {
      const url = `${server}/api/blockchain/${collection}/useritems/${account}`;
      const items = await FETCH(url);
      setUserItems(items);
    };
    fetchUserItems();
  }, [account]);
  return (
    <>
      {!userItems ? (
        <div className={styles.openOffers}>
          <div
            onClick={() => setViewUserItems(false)}
            className={styles.closeModal}
          >
            <IoIosCloseCircleOutline />
          </div>
          <div style={{ color: "white" }}>Loading your NFTs...</div>
        </div>
      ) : userItems.length > 0 ? (
        <div className={styles.openOffers}>
          <div
            onClick={() => setViewUserItems(false)}
            className={styles.closeModal}
            style={{ zIndex: 2 }}
          >
            <IoIosCloseCircleOutline />
          </div>
          <div className={styles.nfts} style={style}>
            <div className={styles["nftFlex"] + " " + styles["nftGrid"]}>
              {userItems.map((nft) => {
                return (
                  <div
                    className={styles.card}
                    key={nft.id}
                    onClick={() => instantSellFunction(nft.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.nft}>
                      <div className={styles.holster}>
                        <div className={styles.nftImg}>
                          <div className={styles.nftGrayscale}>
                            <div className={styles.image}>
                              <Image
                                src={nft.image}
                                alt={nft.id}
                                layout="fill"
                                objectFit="cover"
                                className={styles.image}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={styles.name}
                      style={{ padding: "0.5em 0.75rem" }}
                    >
                      <p style={{ fontSize: "14px", margin: "7px 0" }}>
                        {nft.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p
              style={{
                display: "flex",
                textAlign: "center",
                margin: "10px",
                color: "white",
              }}
            >
              Select an NFT from your collection to sell instantly for
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  margin: "0 5px",
                }}
              >
                {topCollectionOffer.value}
                <KCS width={15} height={15} />
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.openOffers}>
          <div
            onClick={() => setViewUserItems(false)}
            className={styles.closeModal}
          >
            <IoIosCloseCircleOutline />
          </div>
          <div style={{ color: "white" }}>
            You have no items to display for instant sale
          </div>
        </div>
      )}
    </>
  );
}
