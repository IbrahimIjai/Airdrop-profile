import styles from "../../styles/navbar.module.css";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import Connect from "../../constants/Connect";
import { RxHamburgerMenu } from "react-icons/rx";
import { CgClose } from "react-icons/cg";
import Image from "next/image";
import useMediaQuery from "../../hooks/useMediaQueryhooks";
// import { getCart } from "../../utils/utils";

export default function Navbar({ mobileMenuHandler, mobileMenu, setOpenCart }) {
  const { active, account } = useWeb3React();
  const isMobile = useMediaQuery("(max-width: 700px)");
  // const itemCount = getCart("cart");

  return (
    <nav className={styles.nav}>
      <div className={styles.tab}>
        <div className={styles.collections}>
          <Link href="https://marketplace.distant.finance/">
            <a> Marketplace</a>
          </Link>
        </div>
        <div className={styles.profile}>
          <Link href="/">
            <a>Lending</a>
          </Link>
          <p>Coming soon!</p>
        </div>
        <div className={styles.profile}>
          <Link href="https://docs.distant.finance/">
            <a>Docs</a>
          </Link>
        </div>
      </div>
      <div className={styles.mobile}>
        <div
          onClick={mobileMenuHandler}
          className={styles.ham}
          // ref={hamRef}
        >
          {mobileMenu ? (
            <div>
              <CgClose />
            </div>
          ) : (
            <div>
              <RxHamburgerMenu />
            </div>
          )}
        </div>
      </div>

      <div className={styles.logo}>
        <Link href="/">
          <a>
            <div className={styles.logoImage}>
              <Image
                src="/logoL.png"
                objectFit="contain"
                layout="fill"
                alt="Logo"
              />
            </div>
          </a>
        </Link>
      </div>

      <div className={styles.connect}>
        <div
          className={styles.connectBtn}
          style={{ border: !active ? "1px solid rgb(212, 209, 209)" : "" }}>
          <Connect />
        </div>
      </div>
    </nav>
  );
}
