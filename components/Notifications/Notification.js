import Link from "next/link";
import { useEffect, useReducer } from "react";
import styles from "./Notification.module.css";
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
export const ACTIONS = {
  ERROR: "error",
  TXN: "transaction",
  TIMEOUT: "timeout",
  MESSAGE: "message",
  INACTIVE: "not connected",
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ERROR:
      return (state = action.payload ? action.payload : "Execution reverted");
    case ACTIONS.TXN:
      return (state = action.payload);
    case ACTIONS.TIMEOUT:
      return (state = "Error in page load");
    case ACTIONS.MESSAGE:
      return (state = action.payload);
    case ACTIONS.INACTIVE:
      return (state = "Connect wallet to execute transactions");
    default:
      return state;
  }
};

const Notification = ({ action, close }) => {
  const [state, dispatch] = useReducer(notificationReducer, "");
  useEffect(() => {
    dispatch(action);
  }, [action]);

  return (
    <motion.div
      className={styles.notification}
      style={{ height: action.type === ACTIONS.TIMEOUT ? "50vh" : "", border: ".6px solid gray" }}
      initial={{opacity:0, x: 100}}
      animate={{x:0, opacity:1}}
      exit={{x:100, opacity:0}}
      transition={{duration:.5, type:"spring"}}
    >
      <div className={styles.notifyModal}>
        {action.type === ACTIONS.TXN ? (
          <Link href={`https://explorer.kcc.io/en/tx/${state}`}>
            <a target="_blank" rel="noopener noreferrer">
              Successful: Transaction Receipt
            </a>
          </Link>
        ) : (
          <p>{state}</p>
        )}
        <span onClick={() => close(false)}>
          {" "}
          <IoIosClose />{" "}
        </span>
      </div>
    </motion.div>
  );
};

export default Notification;
