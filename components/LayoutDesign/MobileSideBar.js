import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import styles from "../../styles/mobilesidebar.module.css";
import { useRef, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
export default function MobileSideBar({ setMobileMenu }) {
  const { active, account } = useWeb3React();
  const ref = useRef();
  const Links = [
    {
      id: 0,
      name: "Home",
      Route: "/",
    },
    {
      id: 1,
      name: "Marketplace",
      Route: "/collections",
    },
    {
      id: 2,
      name: "Lending",
      Route: "/",
    },
    {
      id: 3,
      name: "Docs",
      Route: "https://docs.distant.finance/",
    },
  ];
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!ref?.current?.contains(e.target)) {
        setMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  });

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        exit={{ x: "100vw", opacity: 0 }}
        ref={ref}
        className={styles.card}>
        {Links.map((link, index) => {
          return (
            <div key={index} style={{position: "relative", display:"flex", alignItems: "center"}}>
              <Link passHref href={link.Route}>
                <a className={styles.link} onClick={() => setMobileMenu(false)}>
                  {link.name}
                </a>
              </Link>
              {link.name == "Lending" && <p>coming soon!</p>}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
