import Typical from "react-typical";
import { RingLoader } from "react-spinners";
import styles from "../../styles/nftId.module.css";

// Loader helper variable
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
export default function Loading() {
  return (
    <div className={styles.PageLoadingModal}>
      <div className={styles.internalLoadingModal}>
        <RingLoader
          color={"#ffffff"}
          loading={true}
          cssOverride={override}
          size={150}
        />
      </div>
      <div className={styles.loadingText}>
        <Typical
          steps={["", 2000, "Loading", 4000, "Loading...", 3000]}
          loop={1}
          wrapper={"h2"}
        />
      </div>
    </div>
  );
}
