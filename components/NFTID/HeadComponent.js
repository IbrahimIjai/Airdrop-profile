import styles from "../../styles/nftId.module.css";
import {
  DELETE,
  MARKETPLACE,
  PUT,
  server,
  zeroAddress,
} from "../../utils/utils";
import {
  acceptBid,
  acceptOffer,
  approveNFT,
  cancelAuction,
  cancelListing,
  cancelOffer,
  FUNCTIONS,
} from "./Functions";
import KCS from "../../assets/KCS";
import {
  AddressNotOwnerButCreateOffer,
  AddressNotOwnerNotListed,
  AddressOwnerNotListed,
  OwnerNotListedApproved,
  ReverseAddressNotOwnerNotListed,
  ReverseAddressOwnerNotListed,
  ReverseAddressNotOwnerButCreateOffer,
  ReverseOwnerNotListedApproved,
} from "./Styles";
import { useContext } from "react";
import { NFTContext } from "../../pages/collection/[collection]/[nftId]";
import { useWeb3React } from "@web3-react/core";
import { ACTIONS } from "../Notifications/Notification";
import TimeStamp from "../../utils/Timestamp";
export default function HeadComponent() {
  let currentTime = new Date() / 1000;
  const {
    currentAccount,
    approved,
    saleInfo,
    allOffers,
    setModal,
    collection,
    nftId,
    setLoading,
    closeTxn,
    setUpdateModalType,
    setUpdateModal,
    setBuyModal,
    setBidOfferModalType,
    setBidOfferModal,
  } = useContext(NFTContext);
  const { library } = useWeb3React();
  const {
    salePrice,
    owner,
    seller,
    saleType,
    bids,
    closeAuctionTime,
    startingBid,
    highestBidder,
    highestBid,
  } = saleInfo;
  const { highestOffer, highestOfferCreator, offerCreatorAddresses } = allOffers
    ? allOffers
    : {
        highestOffer: 0,
        highestOfferCreator: null,
        offerCreatorAddresses: null,
      };
  async function approvenft() {
    let signer = await library.getSigner();
    setLoading(true);
    let txn = await approveNFT(signer, collection, nftId, MARKETPLACE);
    if (txn) {
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setLoading(false);
  }
  async function cancelActiveListing() {
    let signer = await library.getSigner();
    setLoading(true);
    let txn = await cancelListing(signer, collection, nftId);
    let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.CANCELLISTING}`;
    if (txn) {
      await DELETE(url);
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setLoading(false);
  }
  async function cancelinActiveAuction() {
    let signer = await library.getSigner();
    setLoading(true);
    let txn = await cancelAuction(signer, collection, nftId);
    let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.CANCELAUCTION}`;
    if (txn) {
      await DELETE(url);
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setLoading(false);
  }
  async function cancelActiveOffer() {
    let signer = await library.getSigner();
    setLoading(true);
    let txn = await cancelOffer(signer, collection, nftId);
    let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.CANCELOFFER}`;
    if (txn) {
      await PUT(url, { offerCreator: currentAccount });
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setLoading(false);
  }
  async function acceptTopOffer() {
    let signer = await library.getSigner();
    setLoading(true);
    let txn = await acceptOffer(signer, collection, nftId, highestOfferCreator);
    let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.CANCELOFFER}`;
    if (txn) {
      await PUT(url, { offerCreator: highestOfferCreator });
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setLoading(false);
  }
  async function acceptAndCloseAuction() {
    let signer = await library.getSigner();
    setLoading(true);
    let txn = await acceptBid(signer, collection, nftId);
    let url = `${server}/api/mongo/${collection}/${nftId}/modify?type=${FUNCTIONS.ACCEPTBID}`;
    if (txn) {
      await DELETE(url);
      closeTxn(ACTIONS.TXN, txn);
    } else closeTxn(ACTIONS.ERROR);
    setLoading(false);
  }
  const isAuction = saleType === "auctionSale";
  let tokenOwner = saleType === "auctionSale" ? seller : owner;
  let isOwner = currentAccount === tokenOwner;
  let notListed = zeroAddress === seller;
  let auctionClosed = currentTime > Number(closeAuctionTime);
  let isOfferCreator =
    offerCreatorAddresses &&
    offerCreatorAddresses.some((addr) => addr === currentAccount);

  const deadSwitch = () => console.log("DeadSwitch");
  return (
    <>
      {isAuction ? (
        <div className={styles.purchase}>
          <div className={styles.buy}>
            <span>{highestBid === "0.0" ? "Starting Bid" : "Top Bid"}</span>
            <div className={styles.valuePlaceholder}>
              <KCS />
              <h3>{highestBid === "0.0" ? startingBid : highestBid}</h3>
              {/* <span>Not on Sale</span> */}
            </div>
            <div
              onClick={
                isOwner && bids?.length === 0
                  ? cancelinActiveAuction
                  : !isOwner && !auctionClosed
                  ? () => {
                      setBidOfferModalType(FUNCTIONS.MAKEBID);
                      setBidOfferModal(true);
                    }
                  : isOwner && bids?.length > 0
                  ? acceptAndCloseAuction
                  : deadSwitch
              }
              className={styles.buyButton}
            >
              {isOwner && bids?.length === 0 && auctionClosed
                ? "Cancel Auction"
                : !isOwner && !auctionClosed
                ? "Make a Bid"
                : !isOwner && auctionClosed
                ? "Auction Ended"
                : isOwner && bids?.length > 0
                ? "Accept Top Bid"
                : "Auction Ongoing"}
            </div>
            <div className={styles.timestamp}>
              <TimeStamp timestamp={Number(closeAuctionTime)} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.purchase}>
          <div className={styles.buy}>
            <span>Price</span>
            <div className={styles.valuePlaceholder}>
              <KCS />
              <h3>{salePrice}</h3>
              {/* <span>Not on Sale</span> */}
            </div>
            <div
              onClick={
                isOwner && notListed
                  ? () => setModal(true)
                  : !isOwner && notListed
                  ? deadSwitch
                  : isOwner && !approved
                  ? approvenft
                  : () => setBuyModal(true)
              }
              className={styles.buyButton}
              style={
                (!isOwner && notListed
                  ? AddressNotOwnerNotListed
                  : ReverseAddressNotOwnerNotListed,
                isOwner && notListed ? "" : "",
                isOwner && approved && !notListed
                  ? OwnerNotListedApproved
                  : ReverseOwnerNotListedApproved)
              }
            >
              {isOwner && notListed
                ? "List NFT"
                : isOwner && !approved
                ? "Approve NFT"
                : !isOwner && notListed
                ? "Not Listed"
                : "Buy NFT"}
            </div>
            {isOwner && approved && !notListed && (
              <div className={styles.ownerActive}>
                <div
                  onClick={() => {
                    setUpdateModalType(FUNCTIONS.UPDATELISTING);
                    setUpdateModal(true);
                  }}
                  className={styles.ownerActiveUpdate}
                >
                  Update Listing
                </div>
                <div
                  onClick={cancelActiveListing}
                  className={styles.ownerActiveCancel}
                >
                  Cancel Listing
                </div>
              </div>
            )}
          </div>
          {!notListed ? (
            <div className={styles.offers}>
              <p>
                Top Offer:
                {highestOffer ? (
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <KCS width={20} height={20} />
                    {highestOffer}
                  </span>
                ) : (
                  <span>No Offers</span>
                )}
              </p>
              <button
                className={styles.offerButton}
                onClick={
                  !isOwner && !notListed && !isOfferCreator
                    ? () => {
                        setBidOfferModalType(FUNCTIONS.CREATEOFFER);
                        setBidOfferModal(true);
                      }
                    : !isOwner && isOfferCreator
                    ? cancelActiveOffer
                    : isOwner && notListed
                    ? deadSwitch
                    : isOwner && !highestOffer
                    ? deadSwitch
                    : isOwner && highestOffer
                    ? acceptTopOffer
                    : deadSwitch
                }
                style={
                  (isOwner && notListed
                    ? AddressOwnerNotListed
                    : ReverseAddressOwnerNotListed,
                  !isOwner && isOfferCreator
                    ? AddressNotOwnerButCreateOffer
                    : ReverseAddressNotOwnerButCreateOffer)
                }
              >
                {!isOwner && !notListed && !isOfferCreator
                  ? "Make an Offer"
                  : !isOwner && isOfferCreator
                  ? "Cancel Offer"
                  : isOwner && notListed
                  ? "List NFT"
                  : isOwner && !highestOffer
                  ? "No New Offers"
                  : isOwner && highestOffer
                  ? "Accept Offer"
                  : ""}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
