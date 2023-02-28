import styles from "../../styles/nft.module.css";
import Image from "next/image";
import { useContext, useState } from "react";
import { DataContext } from "../../pages/collection/[collection]";

export default function CollectionBanner() {
  const [visibility, setVisibility] = useState(false);
  const { obj } = useContext(DataContext);
  return (
    <div className={styles.banner}>
      <div className={styles.bannerImage}>
        <Image
          src={obj.bannerImage}
          objectFit="cover"
          layout="fill"
          alt={`Banner image for ${obj.name}`}
        />
        <div className={styles.bannerContent}>
          <div className={styles.bannerContentImage}>
            <Image
              src={obj.smallImage}
              objectFit="cover"
              layout="fill"
              alt={`Placeholder image for ${obj.name}`}
            />
          </div>
          <div className={styles.bannerContentDetails}>
            <h1>{obj.name}</h1>
            <p>
              {obj.description.substr(0, 100)}
              {!visibility && "..."}
              {visibility && (
                <span>
                  {obj.description.substr(100, obj.description.length)}
                </span>
              )}
            </p>
            <p
              className={styles.pointer}
              onClick={() => setVisibility((visible) => !visible)}
            >
              {visibility ? "See less..." : "See more..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
