import Button from "./Button";
import styles from "./styles/Hero.module.css";
import Link from "next/link";
const Hero = () => {
  return (
    <div className={styles.blur}>
      <main className={styles.main}>
        <aside>
          <div className={styles.center}>
            <h1>Decentralized, Permissionless!</h1>{" "}
          </div>
          <p>
            {" "}
            Discover a community-centric platform offering limitless connections
            for NFT creators and collectors on KCC.{" "}
          </p>
          <Link href="/collections">
            <a>
              <Button props={"Explore"} />
            </a>
          </Link>
        </aside>
      </main>
    </div>
  );
};

export default Hero;
