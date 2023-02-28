import styles from "./styles/mint.module.css";
import art from "./img/art.png";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
const Mint = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image src={art} layout="fill" objectFit="cover" priority />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.headText}>
            Discover the <span>beauty </span> of
            <span> creativity</span>
          </div>
          <span className={styles.Text}>Revealing the Creativity in you!</span>
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/mint">
          <a>
            <Button props="Mint" />
          </a>
        </Link>
      </div>
    </main>
  );
};
export default Mint;
