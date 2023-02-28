import Image from "next/image";
import styles from "./Styles.module.css";

export default function Preview({ filesURL }) {
  return (
    <div className={styles.previewContainer}>
        <div className={styles.NFTImageDiv}>
          <Image
            src={filesURL}
            layout="fill"
            objectFit="contain"
            alt="Your NFT Image"
          />
        </div>
    </div>
  );
}
