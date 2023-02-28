import { useEffect, useState } from "react";
import Image from "next/image";
import MyLoader from "../LayoutDesign/Skeleton";
import Shimmer from "../LayoutDesign/Shimmer";
import Link from "next/link";
import styles from "../../styles/allCollections.module.css";
import { motion } from "framer-motion";
import { FETCH, server } from "../../utils/utils";
export default function ExploreCollections() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchCollection() {
      let url = `${server}/api/blockchain/collections`;
      const collections = await FETCH(url);
      setData(collections);
    }
    fetchCollection();
  }, []);
  return (
    <>
      <div className={styles.collections}>
        {data.length > 0 ? (
          data.map((collection, i) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: i }}
              className={styles.collection}
              key={i}
            >
              <Link
                href={`/collection/${collection.id}`}
                passHref
                prefetch={false}
              >
                <a>
                  <div className={styles.imageHolster}>
                    <Image
                      src={collection.placeholderImage}
                      layout="fill"
                      alt={`Placeholder image for ${collection.name}`}
                      objectFit="cover"
                      className={styles.image}
                    />
                    <div className={styles.content}>
                      <div className={styles.topContent}>
                        <div className={styles.topContentImage}>
                          <div className={styles.image}>
                            <Image
                              src={collection.smallImage}
                              layout="fill"
                              alt={`Image holster for ${collection.name}`}
                              objectFit="cover"
                            />
                          </div>
                        </div>
                        <div className={styles.topContentName}>
                          <div className={styles.name}>
                            <span>{collection.symbol}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.bottomContent}>
                        <div className={styles.bottomHeader}>
                          <h1>{collection.name}</h1>
                          <div>{collection.totalSupply} Supply</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonNftCard}>
              <MyLoader type="collection" />
              <MyLoader type="collection" />
              <MyLoader type="collection" />
              <MyLoader type="collection" />
              <MyLoader type="collection" />
              <MyLoader type="collection" />
            </div>
            <Shimmer />
          </div>
        )}
      </div>
    </>
  );
}
