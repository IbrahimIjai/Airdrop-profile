import { CgClose } from "react-icons/cg";
import { TfiTrash } from "react-icons/tfi";
import { motion } from "framer-motion";
import {
  disconnect_Backdrop,
  disconnect_modal,
} from "../../../utils/framermotion/Navbar";
import styles from "./WalletModal.module.css";
import { useRef, useEffect, useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import { default as KCSLogo } from "../../../assets/KCS";
import Image from "next/image";
import Link from "next/link";
import {
  getCart,
  num,
  POST,
  quickClear,
  remove,
  server,
} from "../../../utils/utils";
import PaymentMethodKCS from "../../Components/PaymentMethods/PaymentMethodKCS";
import PaymentMethodWKCS from "../../Components/PaymentMethods/PaymentMethodWKCS";
import { BalanceContext } from "../../../context/BalanceContext";
import { useWeb3React } from "@web3-react/core";
import { FUNCTIONS, multiSaleKCS, multiSaleWKCS } from "../../NFTID/Functions";
import { utils } from "ethers";

export default function Cart({ setOpenCart }) {
  const ref = useRef();
  const { active, library } = useWeb3React();
  const [select, setSelect] = useState(0);
  const { KCS, WKCS } = useContext(BalanceContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  useEffect(() => {
    const modalRef = (e) => {
      try {
        if (!ref?.current?.contains(e.target)) {
          setOpenCart(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    document.addEventListener("mousedown", modalRef);
    return () => document.removeEventListener("mousedown", modalRef);
  });
  function removeItem(nft) {
    const { collection, tokenId, id } = nft;
    remove(collection, tokenId, id);
    let newCartItems = getCart("cart");
    setCartItems(newCartItems);
  }
  const total =
    cartItems?.reduce((total, item) => {
      return total + Number(item.salePrice);
    }, 0) ?? 0;
  async function buyTokens() {
    if (!active || select === 0) {
      setOpenCart(false);
      throw new Error("Please connect your wallet, select payment method");
    }
    const signer = await library.getSigner();
    // Get an array of unique collection addresses
    const collections = [...new Set(cartItems.map((item) => item.collection))];
    // Create a 2D nested array
    const nfts = collections.map((collection) => {
      return cartItems
        .filter((item) => item.collection === collection)
        .map((item) => item.tokenId);
    });
    // Map collection to delist
    const collectionMap = {};
    cartItems.forEach((obj) => {
      if (!collectionMap[obj.collection]) {
        collectionMap[obj.collection] = [];
      }
      collectionMap[obj.collection].push({
        tokenId: num(obj.tokenId),
        seller: obj.seller,
      });
    });
    let txn;
    let _total = utils.parseEther(total.toString());
    if (select === 1) {
      txn = await multiSaleKCS(signer, collections, nfts, _total);
    } else {
      txn = await multiSaleWKCS(signer, collections, nfts, _total);
    }

    quickClear();
    setCartItems([]);
    setOpenCart(false);
  }
  return (
    <motion.div
      variants={disconnect_Backdrop}
      initial="init"
      animate="final"
      exit="exit"
      className={styles.Cart}
    >
      <motion.div
        ref={ref}
        variants={disconnect_modal}
        className={styles.smallBoard}
      >
        <div className={styles.header}>
          <div>
            <p>Cart items</p>
            <span
              className={styles.closeModal}
              onClick={() => setOpenCart(false)}
            >
              <CgClose />
            </span>
          </div>
        </div>
        <div className={styles.body}>
          {" "}
          {cartItems.length > 0 ? (
            <>
              <div className={styles.items}>
                {cartItems?.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <Link
                      href={`/collection/${item.collection}/${item.tokenId}`}
                      passHref
                    >
                      <div className={styles.itemCT}>
                        <div className={styles.itemImage}>
                          <Image
                            src={item.image}
                            objectFit="cover"
                            layout="fill"
                          />
                        </div>
                        <div className={styles.itemData}>
                          <p>
                            {item.name.slice(0, item.name.lastIndexOf(" "))}
                          </p>
                          <h2>{item.name}</h2>
                          <h2>{item.salePrice} KCS</h2>
                        </div>
                      </div>
                    </Link>
                    <div
                      className={styles.itemClose}
                      onClick={() => removeItem(item)}
                    >
                      <TfiTrash width="20px" height="20px" />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.UserOffersTotal}>
                <h3>Total</h3>
                <p>
                  {total}
                  <span>
                    <KCSLogo width={18} height={18} />
                  </span>
                </p>
              </div>
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
              <hr />
              <aside className={styles.ExecuteTx}>
                {select === 1 && KCS < total ? (
                  "Insufficient KCS Balance"
                ) : select === 2 && WKCS < total ? (
                  "Insufficient WKCS Balance"
                ) : (
                  // <div className={styles.cta} onClick={buyTokens}>
                  //   Buy Tokens
                  // </div>
                  <div className={styles.cta}>Cart is disabled</div>
                )}
              </aside>
              <p style={{ opacity: "0.8" }}>
                Please note that the items in your cart may not be available for
                purchase, even if they are currently in your cart.
              </p>
            </>
          ) : (
            <div className={styles.empty}>
              <p>No items in your cart yet</p>
              <p>Add items to your cart and purchase them in one click</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
