import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext, useCallback } from "react";
import { DataContext } from "../../pages/drops/[address]";
import styles from "../styles/Minted.module.css";
import KCS from "../../assets/KCS";
import { FETCH, server } from "../../utils/utils";
export default function MintedItems() {
  const { data, address } = useContext(DataContext);
  const [items, setItems] = useState(null);
  const log = useCallback(async () => {
    const url = `${server}/api/blockchain/mintedcollection/items/${address}?uri=${data.baseURI}&supply=${data.totalSupply}`;
    const content = await FETCH(url);
    setItems(content);
  }, [address]);

  useEffect(() => {
    log();
  }, [address]);

  return (
    <main className={styles.MintedItems}>
      <div className={styles.desc}>{data.desc}</div>
      <div className={styles.items}>
        <div className={styles.itemWrapper}>
          {items?.map((item, i) => (
            <Link href={`/collection/${address}/${i + 1}`} key={i}>
              <a>
                <div>
                  <Image
                    src={item.image}
                    alt={item.name}
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
                <p>{item.name}</p>
                <span>
                  {item.salePrice !== null ? (
                    <span>
                      <KCS width={20} height={20} />
                      {item.salePrice}
                    </span>
                  ) : (
                    "NL"
                  )}
                </span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
