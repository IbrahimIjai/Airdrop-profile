import styles from "../Frontpage/styles/skeleton.module.css";

const MyLoader = ({ type }) => {
  return <div className={styles["skeleton"] + " " + styles[`${type}`]}></div>;
};

export default MyLoader;
