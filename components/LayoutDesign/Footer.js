import styles from "../Frontpage/styles/footer.module.css";
import { GrTwitter } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import { SiMedium } from "react-icons/si";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <h1 style={{ textAlign: "center", margin: "10px 0" }}>
        Be a part of our ever growing community
      </h1>
      <div className={styles.socials}>
        {links.map((link) => (
          <Link key={link.link} href={link.link}>
            <a target="_blank">{link.logo}</a>
          </Link>
        ))}
      </div>
      <div className={styles.hr}>
        <hr
          className={styles.copyright}
          data-content="© 2022 | Distance Labs"
        />
      </div>
    </footer>
  );
}

const links = [
  {
    logo: <GrTwitter />,
    link: "https://twitter.com/Distant_Finance",
  },
  {
    logo: <FaTelegramPlane />,
    link: "https://t.me/Distant_Finance",
  },
  {
    logo: <SiMedium />,
    link: "https://medium.com/@Distant_Finance",
  },
];
