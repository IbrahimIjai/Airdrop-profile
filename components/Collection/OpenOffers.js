import { useContext, useRef, useState, useEffect } from "react";
import styles from "../../styles/nft.module.css";
import KCS from "../../assets/KCS";
import WKCS from "../../assets/WKCS";
import { utils } from "ethers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { useWeb3React } from "@web3-react/core";
import { collectionOfferWKCS, collectionOfferKCS } from "../NFTID/Functions";
import Image from "next/image";
import { DataContext } from "../../pages/collection/[collection]";
import { PUT } from "../../utils/utils";
import PaymentMethodKCS from "../Components/PaymentMethods/PaymentMethodKCS";
import PaymentMethodWKCS from "../Components/PaymentMethods/PaymentMethodWKCS";
import { ACTIONS } from "../Notifications/Notification";

export default function OpenOffers() {
  const { library, account } = useWeb3React();
  const [value, setValue] = useState(null);
  const [count, setCount] = useState(1);
  const [select, setSelect] = useState(0);
  const [validity, setValidity] = useState(null);
  const { collection, setOpenOffers, obj, stats, closeTxn } =
    useContext(DataContext);
  let days = [7, 14, 30, 60, 90];
  async function makeOffer() {
    if (value < 0) {
      setOpenOffers(false);
      setOpenNotify(true);
      setErrorMsg("Value must be greater than 0");
    }
    if (count < 1) {
      setOpenOffers(false);
      setOpenNotify(true);
      setErrorMsg("NFT Amount must be greater than 0");
    }
    if (validity === null) {
      setOpenOffers(false);
      setOpenNotify(true);
      setErrorMsg("Offer needs an expiry period");
    }
    if (!(select !== 1 || select !== 2)) {
      setOpenOffers(false);
      setOpenNotify(true);
      setErrorMsg("A payment method is required to be selected");
    }
    const signer = await library.getSigner();
    let amount = count * value;
    const _value = utils.parseEther(amount.toString());
    let txn;
    let dataBody = {
      offerCreator: account,
      offerValue: value,
      nftAmount: count,
      validity: days[validity],
    };
    if (select === 1) {
      txn = await collectionOfferKCS(
        signer,
        collection,
        _value,
        count,
        days[validity]
      );
      if (txn) {
        await PUT(url, dataBody);
        closeTxn(ACTIONS.TXN, txn);
      } else closeTxn(ACTIONS.ERROR);
    } else {
      txn = await collectionOfferWKCS(
        signer,
        collection,
        _value,
        count,
        days[validity]
      );
      if (txn) {
        await PUT(url, dataBody);
        closeTxn(ACTIONS.TXN, txn);
      } else closeTxn(ACTIONS.ERROR);
    }
    setOpenOffers(false);
  }
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      try {
        if (!menuRef.current.contains(e.target)) {
          setOpenOffers(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <div className={styles.openOffers}>
      <div className={styles.openOffersModal} ref={menuRef}>
        <div style={{ padding: "0 1rem 0.7rem", position: "relative" }}>
          <div>Create a Collection Offer </div>
        </div>
        <div className={styles.offerCollectionDetails}>
          <div className={styles.offerCollectionDetailsImageAndName}>
            <Image
              src={obj.smallImage}
              width={100}
              height={100}
              className={styles.cImage}
            />
            <div className={styles.offerCollectionDetailsName}>
              <div>{obj.name}</div>
              <span>
                Collection Floor:{" "}
                <span className={styles.contentFloor}>
                  <KCS width={18} height={18} />{" "}
                  {stats && stats.floor ? stats.floor : 0}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.offersBars}>
          <div className={styles.inputBarContainer}>
            <label htmlFor="value">Price </label>
            <div className={styles.inputBar}>
              <input
                placeholder="Offer value"
                type="number"
                id="value"
                onChange={(e) => setValue(e.target.value)}
              />
              <div className={styles.inputBarCTA}>
                <WKCS width={20} height={20} />
                KCS
              </div>
            </div>
            <label htmlFor="count">NFT amount </label>
            <div className={styles.inputBar}>
              <input
                placeholder="Offer count"
                onChange={(e) => setCount(e.target.value)}
                type="number"
                id="value"
                title="number of NFTs you want to get for the value you pass in"
                min="1"
                value={count}
              />
              <div className={styles.inputBarPS}>
                <span>
                  <GrFormAdd onClick={() => setCount((count) => count + 1)} />
                </span>

                <span>
                  <GrFormSubtract
                    onClick={() => setCount((count) => count - 1)}
                  />
                </span>
              </div>
            </div>
            <label htmlFor="valid">Valid for in Days</label>
            <div id="valid" className={styles.valid}>
              {days.map((day, i) => (
                <span
                  key={i}
                  onClick={() => setValidity(i)}
                  className={`${styles.DaysSelector}  ${
                    validity == i ? styles.activeButton : ""
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          <p>
            Your Offer will apply to any of the{" "}
            <span>{obj.totalSupply} items</span> of this collection
          </p>
          <div className={styles.UserOffersTotal}>
            <h3>Total</h3>
            <p>
              {count * value > 0 && count * value}
              <span>
                <KCS width={18} height={18} />
              </span>
            </p>
          </div>
          <p>
            Your tokens will be locked into the Offers contract. You can
            withdraw when the validity period is over by going to `Your Offers`
            in your Profile.
          </p>
          <div className={styles.PaymentMethod}>
            <p className={styles.container}>Pay with</p>
            <div className={styles.paymentBox}>
              <span onClick={() => setSelect(1)}>
                <PaymentMethodKCS selected={select == 1} />
              </span>
              <span onClick={() => setSelect(2)}>
                <PaymentMethodWKCS selected={select == 2} />
              </span>
            </div>
          </div>
          <div className={styles.inputBarButton}>
            <button disabled={!count || !value} onClick={makeOffer}>
              {value === null || value === 0
                ? "Enter offer value"
                : count < 1
                ? "Enter amount of tokens"
                : validity === null
                ? "Enter expiry in days"
                : select !== 1 && select !== 2
                ? "Select payment Method"
                : "Make Offer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
