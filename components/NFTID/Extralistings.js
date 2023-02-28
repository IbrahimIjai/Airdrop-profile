import styles from "../../styles/nftId.module.css";
import Link from "next/link";
import Image from "next/image";
import KCS from "../../assets/KCS";
import { useContext } from "react";
import { NFTContext } from "../../pages/collection/[collection]/[nftId]";

export default function Extralistings() {
  const { extraListings, collection } = useContext(NFTContext);
  return (
    <>
      {extraListings && extraListings.length > 0 && (
        <div className={styles.moreItems}>
          <div className={styles.head}>
            <h2>More from this collection</h2>
            <hr />
          </div>
          <div className={styles.SliderContainer}>
            <div className={styles.cards}>
              {extraListings.map((listing, i) => (
                <Link
                  href={`/collection/${collection}/${listing.tokenId}`}
                  key={i}
                >
                  <a>
                    <div className={styles.imageContainer}>
                      <Image
                        src={listing.image}
                        alt={listing.name}
                        layout="fill"
                        objectFit="cover"
                        style={{ padding: "0 20px" }}
                      />
                    </div>
                    <div className={styles.description}>
                      <h3>{listing.name}</h3>
                      <p>
                        <span>
                          <KCS width={15} height={15} />
                          {listing.value}
                        </span>
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
