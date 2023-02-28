import styles from "../../styles/nftId.module.css";
import Image from "next/image";
import { useContext } from "react";
import { NFTContext } from "../../pages/collection/[collection]/[nftId]";
import Like from "../../assets/Like";
import Refresh from "../../assets/Refresh";
export default function ImageComponent() {
  const { ipfsData } = useContext(NFTContext);
  return (
    <div className={styles.imageContainer}>
      <div className={styles.image}>
        <Image
          src={ipfsData.image}
          alt={ipfsData.collectionName}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.below}>
        <div className={styles.like}>
          <Like width="20px" height="20px" />
        </div>
        <div className={styles.refresh}>
          <Refresh />
        </div>
      </div>
    </div>
  );
}
