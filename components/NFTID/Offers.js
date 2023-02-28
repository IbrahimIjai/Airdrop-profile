import styles from "../../styles/nftId.module.css";
import {
  AddressOwnerTokenListed,
  ReverseAddressOwnerTokenListed,
} from "./Styles";
import KCS from "../../assets/KCS";
import { acceptOffer, FUNCTIONS } from "./Functions";
import { motion, AnimatePresence } from "framer-motion";
import { attributesBody, _attributes } from "../../utils/framermotion/NFTID";
import { useContext } from "react";
import { NFTContext } from "../../pages/collection/[collection]/[nftId]";
import { PUT, server, slice, zeroAddress } from "../../utils/utils";
import { useWeb3React } from "@web3-react/core";
import { ACTIONS } from "../Notifications/Notification";
export default function Offers() {
  const {
    currentAccount,
    saleInfo,
    allOffers,
    setUpdateModal,
    setUpdateModalType,
    setLoading,
    collection,
    nftId,
    closeTxn,
  } = useContext(NFTContext);
  const { library } = useWeb3React();
  const { owner, seller, saleType } = saleInfo;
  let isAuctionSale = saleType === "auctionSale";
  let tokenOwner = isAuctionSale ? seller : owner;
  let isOwner = currentAccount === tokenOwner;
  let notListed = zeroAddress === seller;
  function d(type) {
    console.log(type);
  }
  async function acceptAnOffer(offerCreator) {
    let signer = await library.getSigner();
    setLoading(true);
    let txn = await acceptOffer(signer, collection, nftId, offerCreator);
    let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.ACCEPTOFFER}`;
    if (txn) {
      await PUT(url, { offerCreator });
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setLoading(false);
  }
  const deadSwitch = () => console.log("DeadSwitch");
  return (
    <>
      {" "}
      <div className={styles.openOffers}>
        <div className={styles.box}>
          <div className={styles.head}>
            {allOffers?.offers.length > 0 ? (
              <h2>Offers</h2>
            ) : (
              <h2>No Offers</h2>
            )}
            <hr />
          </div>
          <div className={styles.body}>
            <AnimatePresence>
              <motion.div
                variants={attributesBody}
                initial="init"
                whileInView="final"
              >
                {allOffers ? (
                  allOffers.offers.length > 0 ? (
                    <>
                      <div className={styles.offerHead}>
                        <h4>Price</h4>
                        <h4>Floor</h4>
                        {isOwner ? <h4>Action</h4> : <h4>From</h4>}
                      </div>
                      {allOffers.offers.map((offer, i) => (
                        <div className={styles.offerBody} key={i}>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "2px",
                            }}
                          >
                            <KCS width={20} height={20} />
                            {offer.value}
                          </p>
                          <p>
                            {notListed ? "-" : offer.floorDifference}%{" "}
                            {Math.sign(offer.floorDifference) === -1 ? (
                              <span>Below</span>
                            ) : (
                              <span>Above</span>
                            )}
                          </p>
                          <div
                            onClick={
                              currentAccount === offer.address
                                ? () => {
                                    setUpdateModalType(FUNCTIONS.UPDATEOFFER);
                                    setUpdateModal(true);
                                  }
                                : isOwner && !notListed && !isAuctionSale
                                ? () => acceptAnOffer(offer.address)
                                : deadSwitch
                            }
                            style={
                              (isOwner && !notListed && !isAuctionSale) ||
                              currentAccount === offer.address
                                ? AddressOwnerTokenListed
                                : ReverseAddressOwnerTokenListed
                            }
                            className={styles.offersContainer}
                          >
                            <div className={styles.function}>
                              {currentAccount === offer.address ? (
                                "Update"
                              ) : isOwner && !notListed && !isAuctionSale ? (
                                "Accept"
                              ) : (
                                <span>{slice(offer.address)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>No Offers</div>
                  )
                ) : (
                  <div>Loading offers...</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
