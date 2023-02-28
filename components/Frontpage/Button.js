import styles from "../../styles/Button.module.css";
const Button = ({ props }) => {
  return <div className={styles.button}>{props}</div>;
};
export default Button;
