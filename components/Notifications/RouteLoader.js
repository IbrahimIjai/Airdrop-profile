import { ClipLoader } from "react-spinners";
import styles from "./Notification.module.css"
export default function RouteLoader() {
  return (
    <div  className={styles.routeloadercontainer}>
      <ClipLoader color="#faf8f8" size={60} />
    </div>
  );
}
