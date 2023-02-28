import styles from "../../styles/nft.module.css";
import { BsThreeDots, BsGlobe, BsTwitter, BsTelegram } from "react-icons/bs";
import Link from "next/link";
import { DataContext } from "../../pages/collection/[collection]";
import { useContext, useState, useRef, useEffect } from "react";
export default function CollectionDescription() {
  const { obj, stats, collection } = useContext(DataContext);
  const [linkShow, setLinkShow] = useState(false);
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      try {
        if (!menuRef.current.contains(e.target)) {
          setLinkShow(false);
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
    <div className={styles.description}>
      <div className={styles.stats}>
        <div>
          <h3>{obj.totalSupply ? obj.totalSupply : "-"}</h3>
          <p>Items</p>
        </div>
        <div>
          <h3>{stats ? stats.listed : "-"}</h3>
          <p>Listed</p>
        </div>
        <div>
          <h3>{obj.tradeVolume > 0 ? `$${obj.tradeVolume}` : "-"}</h3>
          <p>Volume</p>
        </div>
        <div>
          <h3>{stats ? `$${stats.floor}` : "-"}</h3>
          <p>Floor</p>
        </div>
        <div>
          <h3>{obj.offersTvl > 0 ? obj.offersTvl : "-"}</h3>
          <p>Offers TVL</p>
        </div>
      </div>
      <div
        className={styles.links}
        onClick={() => setLinkShow((link) => !link)}
        ref={menuRef}
      >
        {!linkShow && <BsThreeDots />}
        {linkShow && (
          <ul>
            <Link href={`https://explorer.kcc.io/en/address/${collection}`}>
              <a target="_blank" rel="noopener noreferrer">
                <li>
                  <BsGlobe />
                </li>
              </a>
            </Link>
            <Link href={obj.twitter}>
              <a target="_blank">
                <li>
                  <BsTwitter />
                </li>
              </a>
            </Link>
            <Link href={obj.telegram}>
              <a target="_blank">
                <li>
                  <BsTelegram />
                </li>
              </a>
            </Link>
          </ul>
        )}
      </div>
    </div>
  );
}
